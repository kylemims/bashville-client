# CRITICAL BACKEND FIXES NEEDED

## 1. Fix Note Model (bashvilleapi/models/note.py)

The model has circular dependency issues. Here are the key fixes:

### Problem Areas:
```python
# REMOVE these method calls that depend on self.content:
- auto_generate_title() uses self.content (line 88)
- auto_detect_category() uses self.content (line 104) 
- detect_code_content() uses self.content (line 175)
- update_search_vector() uses self.content (line 208)
```

### FIXED MODEL CODE:

```python
import re
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from .project import Project


class Note(models.Model):
    """
    Developer notes with smart categorization and project context.
    Now using block-based architecture for flexible content.
    """

    # Category choices
    CATEGORY_CHOICES = [
        ("note", "General Note"),
        ("bug", "Bug Report"), 
        ("todo", "Task/Todo"),
        ("wishlist", "Feature Idea"),
        ("code", "Code Snippet"),
        ("reminder", "Reminder"),
        ("question", "Question"),
    ]

    # Core fields
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="notes", 
        null=True,
        blank=True,
        help_text="Optional project association for context",
    )

    # Content fields
    title = models.CharField(
        max_length=200, blank=True, help_text="Auto-generated from content if empty"
    )
    blocks = models.JSONField(
        default=list, help_text="Content blocks (text, checklist, code, etc.)"
    )

    # Organization fields
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="note",
        help_text="Auto-detected based on content",
    )
    custom_tags = models.JSONField(
        default=list,
        blank=True,
        help_text="User-defined tags",
    )
    priority_level = models.CharField(
        max_length=10,
        choices=[
            ("low", "Low Priority"),
            ("medium", "Medium Priority"), 
            ("high", "High Priority"),
        ],
        default="medium",
    )

    # Status fields
    is_pinned = models.BooleanField(default=False)
    is_code_snippet = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    is_important = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    search_vector = models.TextField(blank=True)

    class Meta:
        ordering = ["-is_pinned", "order", "-updated_at"]
        indexes = [
            models.Index(fields=["user", "project"]),
            models.Index(fields=["user", "category"]),
            models.Index(fields=["user", "is_pinned"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["user", "order"]),
        ]

    def __str__(self):
        title = self.title or self.auto_generate_title()
        project_title = f" ({self.project.title})" if self.project else ""
        return f"{title}{project_title}"

    def save(self, *args, **kwargs):
        """Enhanced save with auto-processing."""
        # Auto-generate title if empty
        if not self.title:
            self.title = self.auto_generate_title()

        # Auto-detect category if still default
        if self.category == "note":
            self.category = self.auto_detect_category()

        # Auto-detect code snippets
        self.is_code_snippet = self.detect_code_content()

        # Update search vector
        self.update_search_vector()

        super().save(*args, **kwargs)

    @property
    def content(self):
        """Backward compatibility - return combined block content"""
        if not self.blocks or not isinstance(self.blocks, list):
            return ""

        content_parts = []
        for block in self.blocks:
            if block.get("type") == "text":
                content_parts.append(block.get("content", ""))
            elif block.get("type") == "checklist":
                for item in block.get("items", []):
                    status = "[x]" if item.get("completed") else "[ ]"
                    content_parts.append(f"- {status} {item.get('text', '')}")
            elif block.get("type") == "code":
                lang = block.get("language", "")
                content_parts.append(f"```{lang}\n{block.get('content', '')}\n```")

        return "\n\n".join(content_parts)

    def auto_generate_title(self):
        """Generate title from first block content."""
        if not self.blocks:
            return "Empty Note"

        first_block = self.blocks[0] if self.blocks else {}
        
        if first_block.get("type") == "text":
            content = first_block.get("content", "")
        elif first_block.get("type") == "checklist":
            items = first_block.get("items", [])
            content = f"Checklist with {len(items)} items"
        elif first_block.get("type") == "code":
            lang = first_block.get("language", "code")
            content = f"{lang} code block"
        else:
            content = "Note content"

        if isinstance(content, str) and content.strip():
            # Take first line, clean it up
            first_line = content.split("\n")[0].strip()
            clean_line = re.sub(r"[`*#\-\[\]]+", "", first_line).strip()
            
            if len(clean_line) > 50:
                return clean_line[:47] + "..."
            return clean_line or "Note"
        
        return "Note"

    def auto_detect_category(self):
        """Smart category detection from blocks."""
        combined_content = self.content.lower()
        
        if not combined_content:
            return "note"

        # Bug detection
        if any(word in combined_content for word in ["bug", "error", "broken", "fix", "issue"]):
            return "bug"

        # Todo detection
        if any(pattern in combined_content for pattern in ["[ ]", "todo", "task", "need to"]):
            return "todo"

        # Code detection
        if any(block.get("type") == "code" for block in self.blocks):
            return "code"

        # Question detection  
        if "?" in combined_content or any(word in combined_content for word in ["question", "how to", "why"]):
            return "question"

        return "note"

    def detect_code_content(self):
        """Check if note contains code blocks."""
        return any(block.get("type") == "code" for block in self.blocks)

    def update_search_vector(self):
        """Update search field."""
        search_content = []
        
        if self.title:
            search_content.append(self.title)
            
        # Add block content
        search_content.append(self.content)
        
        if self.project:
            search_content.append(self.project.title)
            
        if self.custom_tags:
            search_content.extend(self.custom_tags)

        self.search_vector = " ".join(search_content).lower()

    # Keep existing utility methods unchanged
    def add_tag(self, tag):
        """Add a custom tag to the note."""
        if not self.custom_tags:
            self.custom_tags = []

        tag = tag.strip().lower()
        if tag and tag not in self.custom_tags:
            self.custom_tags.append(tag)
            self.save()

    def toggle_pin(self):
        """Toggle the pinned status of the note."""
        self.is_pinned = not self.is_pinned
        self.save()
        return self.is_pinned

    def toggle_completion(self):
        """Toggle completion status for todo-type notes."""
        self.is_completed = not self.is_completed
        self.save()
        return self.is_completed

    @property
    def age_in_days(self):
        """Get the age of the note in days."""
        return (timezone.now().date() - self.created_at.date()).days

    @property
    def is_recent(self):
        """Check if note was created in the last 7 days."""
        return self.age_in_days <= 7
```

## 2. Fix Note Serializer (bashvilleapi/serializers/note.py)

Remove all content validation and references:

```python
from rest_framework import serializers
from ..models import Note


class NoteSerializer(serializers.ModelSerializer):
    """Block-based note serializer."""

    # Read-only computed fields
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    project_title = serializers.CharField(source="project.title", read_only=True)
    user_username = serializers.CharField(source="user.username", read_only=True)
    age_in_days = serializers.IntegerField(read_only=True)
    is_recent = serializers.BooleanField(read_only=True)
    content = serializers.CharField(read_only=True)  # Computed property

    class Meta:
        model = Note
        fields = [
            "id",
            "title", 
            "blocks",  # Main content field
            "content", # Backward compatibility (read-only)
            "category",
            "category_display",
            "priority_level",
            "custom_tags",
            "is_pinned",
            "is_code_snippet", 
            "is_completed",
            "is_important",
            "is_archived",
            "order",
            "project",
            "project_title",
            "user_username",
            "created_at",
            "updated_at",
            "age_in_days",
            "is_recent",
        ]
        read_only_fields = [
            "id",
            "created_at", 
            "updated_at",
            "user_username",
            "project_title", 
            "category_display",
            "age_in_days",
            "is_recent",
            "content",  # Computed from blocks
        ]

    def validate_blocks(self, value):
        """Validate blocks structure."""
        if not isinstance(value, list):
            raise serializers.ValidationError("Blocks must be a list.")
        
        # Basic validation - each block needs type and id
        for i, block in enumerate(value):
            if not isinstance(block, dict):
                raise serializers.ValidationError(f"Block {i} must be an object.")
            
            if "type" not in block:
                raise serializers.ValidationError(f"Block {i} missing type field.")
                
            if "id" not in block:
                raise serializers.ValidationError(f"Block {i} missing id field.")
                
        return value

    def validate_title(self, value):
        """Validate note title."""
        if value and len(value) > 200:
            raise serializers.ValidationError("Title cannot exceed 200 characters.")
        return value.strip() if value else value

    def create(self, validated_data):
        """Create note with user assignment."""
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["user"] = request.user
        return super().create(validated_data)


# Keep the list and quick serializers but remove content references
class NoteListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for note lists."""
    
    project_title = serializers.CharField(source="project.title", read_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    content = serializers.CharField(read_only=True)  # Computed

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "blocks", 
            "content",  # For preview
            "category",
            "category_display", 
            "priority_level",
            "is_pinned",
            "is_completed",
            "is_important",
            "is_archived",
            "project",
            "project_title",
            "created_at",
            "updated_at",
            "custom_tags",
        ]
```

## 3. Create Migration

You need migration 0008_note_blocks.py:

```python
from django.db import migrations, models
import json

def migrate_content_to_blocks(apps, schema_editor):
    """Migrate existing content to blocks format."""
    Note = apps.get_model('bashvilleapi', 'Note')
    
    for note in Note.objects.all():
        if hasattr(note, 'content') and note.content and not note.blocks:
            # Convert to single text block
            note.blocks = [{
                "id": "block-1",
                "type": "text", 
                "content": note.content,
                "order": 0
            }]
            note.save(update_fields=['blocks'])

class Migration(migrations.Migration):
    dependencies = [
        ('bashvilleapi', '0007_note_priority_level'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='blocks',
            field=models.JSONField(default=list, help_text='Content blocks'),
        ),
        migrations.RunPython(migrate_content_to_blocks),
    ]
```

Apply these fixes to your server-side files and the backend issues should be resolved!