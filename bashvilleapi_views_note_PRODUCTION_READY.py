# -*- coding: utf-8 -*-
"""
Block-based Notes ViewSet - Production Ready
Compatible with enhanced Note model and React block architecture

Key Features:
- Full block-based CRUD operations
- Backward compatibility for legacy content field
- Advanced search with block content indexing
- Comprehensive statistics including block analytics
- Enhanced error handling and validation
- Optimized queries with proper prefetching
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count, Case, When, IntegerField
from django.utils import timezone
from datetime import timedelta
from collections import Counter

from ..models import Note, Project
from ..serializers import (
    NoteSerializer,
    NoteListSerializer,
    NoteStatsSerializer,
    QuickNoteSerializer,
)


class NoteViewSet(viewsets.ModelViewSet):
    """
    Enhanced ViewSet for block-based Note management.

    Features:
    - Full CRUD operations with block validation
    - Advanced search with block content indexing
    - Quick note creation with content-to-blocks conversion
    - Bulk operations with transaction safety
    - Comprehensive statistics and analytics
    - Project-specific filtering with security
    - Category auto-detection from blocks
    """

    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # Updated search fields for block compatibility
    search_fields = ["title", "search_vector", "custom_tags"]
    ordering_fields = [
        "created_at",
        "updated_at",
        "title",
        "category",
        "priority_level",
    ]
    ordering = ["-is_pinned", "order", "-updated_at"]

    def get_queryset(self):
        """Get notes for authenticated user with optimized block-aware queries."""
        queryset = (
            Note.objects.filter(user=self.request.user)
            .select_related("project")
            .prefetch_related("project__user")
        )

        # Enhanced filtering for block-based notes
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category)

        project_id = self.request.query_params.get("project")
        if project_id:
            try:
                queryset = queryset.filter(project_id=int(project_id))
            except (ValueError, TypeError):
                pass

        is_pinned = self.request.query_params.get("pinned")
        if is_pinned is not None:
            queryset = queryset.filter(is_pinned=is_pinned.lower() == "true")

        is_completed = self.request.query_params.get("completed")
        if is_completed is not None:
            queryset = queryset.filter(is_completed=is_completed.lower() == "true")

        is_code = self.request.query_params.get("code")
        if is_code is not None:
            queryset = queryset.filter(is_code_snippet=is_code.lower() == "true")

        # Enhanced tag filtering with better performance
        tags = self.request.query_params.get("tags")
        if tags:
            tag_list = [tag.strip().lower() for tag in tags.split(",")]
            for tag in tag_list:
                queryset = queryset.filter(custom_tags__contains=tag)

        # Date filtering with timezone awareness
        since = self.request.query_params.get("since")
        if since:
            try:
                days = int(since)
                since_date = timezone.now() - timedelta(days=days)
                queryset = queryset.filter(created_at__gte=since_date)
            except (ValueError, TypeError):
                pass

        # Priority filtering
        priority = self.request.query_params.get("priority")
        if priority and priority in ["low", "medium", "high"]:
            queryset = queryset.filter(priority_level=priority)

        # Archive filtering (exclude archived by default)
        is_archived = self.request.query_params.get("is_archived", "false")
        if is_archived.lower() == "false":
            queryset = queryset.filter(is_archived=False)

        return queryset

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == "list":
            return NoteListSerializer
        elif self.action == "quick_create":
            return QuickNoteSerializer
        return NoteSerializer

    def create(self, request, *args, **kwargs):
        """Create note with enhanced block validation and feedback."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = serializer.save()

        # Enhanced response with auto-detection feedback
        response_serializer = NoteSerializer(note, context={"request": request})

        return Response(
            {
                "note": response_serializer.data,
                "message": f"Note created successfully! Auto-detected as: {note.get_category_display()}",
                "auto_detected": {
                    "category": note.category,
                    "is_code": note.is_code_snippet,
                    "title_generated": not request.data.get("title"),
                    "block_count": len(note.safe_blocks),
                },
            },
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        """Update note with comprehensive change tracking."""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        # Enhanced change tracking
        old_category = instance.category
        old_pinned = instance.is_pinned
        old_blocks = instance.blocks
        old_priority = instance.priority_level

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        note = serializer.save()

        # Build comprehensive change summary
        changes = []
        if old_category != note.category:
            changes.append(f"Category changed to {note.get_category_display()}")
        if old_pinned != note.is_pinned:
            changes.append("Pinned status toggled")
        if old_priority != note.priority_level:
            changes.append(f"Priority changed to {note.priority_level}")
        if old_blocks != note.blocks:
            changes.append(f"Content updated ({len(note.safe_blocks)} blocks)")

        return Response(
            {
                "note": serializer.data,
                "message": "Note updated successfully!",
                "changes": changes,
                "block_count": len(note.safe_blocks),
            }
        )

    @action(detail=False, methods=["post"])
    def quick_create(self, request):
        """
        Enhanced quick note creation with content-to-blocks conversion.

        Supports both legacy 'content' field and new 'blocks' field.
        Automatically converts plain text content to text blocks.
        """
        data = request.data.copy()

        # Handle legacy content field - convert to blocks
        if "content" in data and "blocks" not in data:
            content = data.get("content", "").strip()
            if content:
                # Convert content to a text block
                data["blocks"] = [
                    {
                        "id": "quick-block-1",
                        "type": "text",
                        "content": content,
                        "order": 0,
                    }
                ]
            else:
                return Response(
                    {"error": "Content or blocks required for note creation"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Ensure blocks exist
        if not data.get("blocks"):
            return Response(
                {"error": "Blocks required for note creation"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = QuickNoteSerializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        note = serializer.save()

        # Return enhanced response for client compatibility
        return Response(
            {
                "id": note.id,
                "title": note.title or note.auto_generate_title(),
                "category": note.category,
                "blocks": note.blocks,
                "block_count": len(note.safe_blocks),
                "message": "Quick note saved!",
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["get"])
    def search(self, request):
        """Enhanced search with block content awareness."""
        query = request.query_params.get("q", "").strip()

        if not query:
            return Response({"results": [], "message": "No search query provided"})

        # Parse advanced search syntax
        project_search = None
        category_search = None
        tag_search = []
        block_type_search = None
        text_query = query

        # Extract special search patterns
        if "project:" in query:
            parts = query.split("project:")
            if len(parts) > 1:
                project_part = parts[1].split()[0]
                project_search = project_part
                text_query = query.replace(f"project:{project_part}", "").strip()

        if "category:" in query:
            parts = query.split("category:")
            if len(parts) > 1:
                category_part = parts[1].split()[0]
                category_search = category_part
                text_query = query.replace(f"category:{category_part}", "").strip()

        if "type:" in query:
            parts = query.split("type:")
            if len(parts) > 1:
                type_part = parts[1].split()[0]
                if type_part in ["text", "checklist", "code"]:
                    block_type_search = type_part
                text_query = query.replace(f"type:{type_part}", "").strip()

        if "tag:" in query:
            import re

            tag_matches = re.findall(r"tag:(\w+)", query)
            tag_search = tag_matches
            for tag in tag_matches:
                text_query = text_query.replace(f"tag:{tag}", "").strip()

        # Build enhanced search queryset
        queryset = self.get_queryset()

        if project_search:
            queryset = queryset.filter(
                Q(project__title__icontains=project_search)
                | Q(project__id=project_search if project_search.isdigit() else 0)
            )

        if category_search:
            queryset = queryset.filter(category__icontains=category_search)

        if tag_search:
            for tag in tag_search:
                queryset = queryset.filter(custom_tags__contains=tag)

        # Enhanced text search including block content
        if text_query:
            queryset = queryset.filter(
                Q(title__icontains=text_query) | Q(search_vector__icontains=text_query)
            )

        # Block type filtering
        if block_type_search:
            # Filter notes that have blocks of specified type
            # This requires iterating through JSONField data
            filtered_ids = []
            for note in queryset:
                for block in note.safe_blocks:
                    if block.get("type") == block_type_search:
                        filtered_ids.append(note.id)
                        break
            queryset = queryset.filter(id__in=filtered_ids)

        # Limit results and serialize
        results = queryset[:50]
        serializer = NoteListSerializer(
            results, many=True, context={"request": request}
        )

        return Response(
            {
                "results": serializer.data,
                "count": len(results),
                "query": query,
                "parsed_search": {
                    "text": text_query,
                    "project": project_search,
                    "category": category_search,
                    "tags": tag_search,
                    "block_type": block_type_search,
                },
            }
        )

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Get comprehensive note statistics with enhanced block analytics."""
        queryset = self.get_queryset()

        # Basic counts
        total_notes = queryset.count()
        pinned_count = queryset.filter(is_pinned=True).count()
        recent_count = queryset.filter(
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        code_snippets = queryset.filter(is_code_snippet=True).count()
        archived_count = queryset.filter(is_archived=True).count()

        # Category breakdown with enhanced statistics
        category_stats = (
            queryset.values("category").annotate(count=Count("id")).order_by("-count")
        )
        notes_by_category = {item["category"]: item["count"] for item in category_stats}

        # Project breakdown with null handling
        project_stats = (
            queryset.filter(project__isnull=False)
            .values("project__title")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        notes_by_project = {
            item["project__title"]: item["count"] for item in project_stats
        }

        # Priority level breakdown
        priority_stats = (
            queryset.values("priority_level")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        notes_by_priority = {
            item["priority_level"]: item["count"] for item in priority_stats
        }

        # Todo statistics
        todo_notes = queryset.filter(category__in=["todo", "reminder"])
        completed_todos = todo_notes.filter(is_completed=True).count()
        pending_todos = todo_notes.filter(is_completed=False).count()

        # Enhanced tag analytics
        all_tags = []
        for note in queryset.filter(custom_tags__isnull=False):
            if isinstance(note.custom_tags, list):
                all_tags.extend(note.custom_tags)

        popular_tags = [
            {"tag": tag, "count": count}
            for tag, count in Counter(all_tags).most_common(10)
        ]

        # Comprehensive block statistics
        block_stats = {
            "total_blocks": 0,
            "text_blocks": 0,
            "checklist_blocks": 0,
            "code_blocks": 0,
            "average_blocks_per_note": 0,
            "notes_with_blocks": 0,
            "longest_note_blocks": 0,
            "block_type_distribution": {
                "text": 0,
                "checklist": 0,
                "code": 0,
            },
        }

        # Calculate enhanced block statistics
        notes_with_blocks = 0
        total_block_count = 0
        max_blocks_in_note = 0

        for note in queryset:
            note_blocks = note.safe_blocks
            if note_blocks:
                notes_with_blocks += 1
                note_block_count = len(note_blocks)
                total_block_count += note_block_count

                if note_block_count > max_blocks_in_note:
                    max_blocks_in_note = note_block_count

                for block in note_blocks:
                    block_type = block.get("type", "")
                    if block_type == "text":
                        block_stats["text_blocks"] += 1
                        block_stats["block_type_distribution"]["text"] += 1
                    elif block_type == "checklist":
                        block_stats["checklist_blocks"] += 1
                        block_stats["block_type_distribution"]["checklist"] += 1
                    elif block_type == "code":
                        block_stats["code_blocks"] += 1
                        block_stats["block_type_distribution"]["code"] += 1

        block_stats.update(
            {
                "total_blocks": total_block_count,
                "notes_with_blocks": notes_with_blocks,
                "longest_note_blocks": max_blocks_in_note,
                "average_blocks_per_note": (
                    round(total_block_count / total_notes, 1) if total_notes > 0 else 0
                ),
            }
        )

        # Compile comprehensive stats data
        stats_data = {
            "total_notes": total_notes,
            "notes_by_category": notes_by_category,
            "notes_by_project": notes_by_project,
            "notes_by_priority": notes_by_priority,
            "pinned_count": pinned_count,
            "recent_count": recent_count,
            "archived_count": archived_count,
            "completed_todos": completed_todos,
            "pending_todos": pending_todos,
            "code_snippets": code_snippets,
            "popular_tags": popular_tags,
            "block_stats": block_stats,
        }

        serializer = NoteStatsSerializer(stats_data)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def toggle_pin(self, request, pk=None):
        """Toggle pin status with enhanced feedback."""
        note = self.get_object()
        new_status = note.toggle_pin()

        return Response(
            {
                "id": note.id,
                "is_pinned": new_status,
                "title": note.title or note.auto_generate_title(),
                "message": f'Note "{note.title or note.auto_generate_title()}" {"pinned" if new_status else "unpinned"} successfully!',
            }
        )

    @action(detail=True, methods=["post"])
    def toggle_completion(self, request, pk=None):
        """Toggle completion with category validation."""
        note = self.get_object()

        if note.category not in ["todo", "reminder"]:
            return Response(
                {
                    "error": "Only todo and reminder notes can be marked as completed",
                    "current_category": note.category,
                    "allowed_categories": ["todo", "reminder"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_status = note.toggle_completion()

        return Response(
            {
                "id": note.id,
                "is_completed": new_status,
                "title": note.title or note.auto_generate_title(),
                "message": f'Note "{note.title or note.auto_generate_title()}" marked as {"completed" if new_status else "pending"}!',
            }
        )

    @action(detail=True, methods=["post"])
    def add_tag(self, request, pk=None):
        """Add tag with validation and duplicate prevention."""
        note = self.get_object()
        tag = request.data.get("tag", "").strip().lower()

        if not tag:
            return Response(
                {"error": "Tag cannot be empty"}, status=status.HTTP_400_BAD_REQUEST
            )

        if len(tag) > 30:
            return Response(
                {"error": "Tag cannot exceed 30 characters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Prevent duplicate tags
        if tag in (note.custom_tags or []):
            return Response(
                {
                    "error": f'Tag "{tag}" already exists on this note',
                    "existing_tags": note.custom_tags,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        note.add_tag(tag)

        return Response(
            {
                "id": note.id,
                "custom_tags": note.custom_tags,
                "message": f'Tag "{tag}" added successfully!',
            }
        )

    @action(detail=True, methods=["post"])
    def remove_tag(self, request, pk=None):
        """Remove tag with existence validation."""
        note = self.get_object()
        tag = request.data.get("tag", "").strip().lower()

        if not tag:
            return Response(
                {"error": "Tag cannot be empty"}, status=status.HTTP_400_BAD_REQUEST
            )

        if tag not in (note.custom_tags or []):
            return Response(
                {
                    "error": f'Tag "{tag}" not found on this note',
                    "existing_tags": note.custom_tags or [],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        note.remove_tag(tag)

        return Response(
            {
                "id": note.id,
                "custom_tags": note.custom_tags,
                "message": f'Tag "{tag}" removed successfully!',
            }
        )

    @action(detail=False, methods=["post"])
    def bulk_actions(self, request):
        """Enhanced bulk operations with validation and feedback."""
        note_ids = request.data.get("note_ids", [])
        action_type = request.data.get("action")

        if not note_ids or not action_type:
            return Response(
                {"error": "note_ids and action are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(note_ids, list):
            return Response(
                {"error": "note_ids must be a list"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = self.get_queryset().filter(id__in=note_ids)
        count = queryset.count()

        if count == 0:
            return Response(
                {"error": "No valid notes found with provided IDs"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            if action_type == "delete":
                deleted_titles = [
                    note.title or note.auto_generate_title() for note in queryset[:5]
                ]
                queryset.delete()
                message = f"{count} notes deleted successfully"
                if deleted_titles:
                    message += f" (including: {', '.join(deleted_titles)}{'...' if count > 5 else ''})"

            elif action_type == "pin":
                queryset.update(is_pinned=True)
                message = f"{count} notes pinned successfully"

            elif action_type == "unpin":
                queryset.update(is_pinned=False)
                message = f"{count} notes unpinned successfully"

            elif action_type == "complete":
                todo_count = queryset.filter(category__in=["todo", "reminder"]).update(
                    is_completed=True
                )
                message = f"{todo_count} of {count} notes marked as completed (todo/reminder notes only)"

            elif action_type == "archive":
                queryset.update(is_archived=True)
                message = f"{count} notes archived successfully"

            elif action_type == "unarchive":
                queryset.update(is_archived=False)
                message = f"{count} notes unarchived successfully"

            elif action_type == "set_category":
                new_category = request.data.get("category")
                if new_category not in dict(Note.CATEGORY_CHOICES):
                    return Response(
                        {
                            "error": "Invalid category",
                            "valid_categories": [
                                choice[0] for choice in Note.CATEGORY_CHOICES
                            ],
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                queryset.update(category=new_category)
                message = f"{count} notes updated to category: {new_category}"

            elif action_type == "set_priority":
                new_priority = request.data.get("priority")
                if new_priority not in ["low", "medium", "high"]:
                    return Response(
                        {
                            "error": "Invalid priority level",
                            "valid_priorities": ["low", "medium", "high"],
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                queryset.update(priority_level=new_priority)
                message = f"{count} notes updated to priority: {new_priority}"

            else:
                return Response(
                    {
                        "error": "Invalid action type",
                        "valid_actions": [
                            "delete",
                            "pin",
                            "unpin",
                            "complete",
                            "archive",
                            "unarchive",
                            "set_category",
                            "set_priority",
                        ],
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            return Response(
                {"error": f"Bulk operation failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "message": message,
                "affected_count": count,
                "action": action_type,
            }
        )

    @action(detail=False, methods=["get"])
    def recent(self, request):
        """Get recent notes with configurable timeframe."""
        days = request.query_params.get("days", 7)
        try:
            days = int(days)
            days = min(days, 365)  # Cap at 1 year
        except (ValueError, TypeError):
            days = 7

        limit = request.query_params.get("limit", 20)
        try:
            limit = int(limit)
            limit = min(limit, 100)  # Cap at 100
        except (ValueError, TypeError):
            limit = 20

        recent_notes = self.get_queryset().filter(
            created_at__gte=timezone.now() - timedelta(days=days)
        )[:limit]

        serializer = NoteListSerializer(
            recent_notes, many=True, context={"request": request}
        )

        return Response(
            {
                "notes": serializer.data,
                "count": len(recent_notes),
                "timeframe_days": days,
                "limit_applied": limit,
            }
        )

    @action(detail=False, methods=["get"])
    def by_project(self, request, project_id=None):
        """Get notes by project with enhanced validation."""
        project_id = request.query_params.get("project_id") or project_id

        if not project_id:
            return Response(
                {"error": "project_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            project_id = int(project_id)
            project = Project.objects.get(id=project_id, user=request.user)
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid project_id format"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found or access denied"},
                status=status.HTTP_404_NOT_FOUND,
            )

        notes = self.get_queryset().filter(project=project)
        serializer = NoteListSerializer(notes, many=True, context={"request": request})

        # Enhanced project statistics
        category_breakdown = {}
        for note in notes:
            cat = note.category
            category_breakdown[cat] = category_breakdown.get(cat, 0) + 1

        return Response(
            {
                "project": {
                    "id": project.id,
                    "title": project.title,
                    "description": project.description,
                },
                "notes": serializer.data,
                "count": len(notes),
                "category_breakdown": category_breakdown,
                "pinned_count": sum(1 for note in notes if note.is_pinned),
                "completed_todos": sum(
                    1
                    for note in notes
                    if note.category in ["todo", "reminder"] and note.is_completed
                ),
            }
        )

    @action(detail=True, methods=["post"])
    def duplicate(self, request, pk=None):
        """Create a duplicate of an existing note."""
        original_note = self.get_object()

        # Create duplicate with modified title
        duplicate_data = {
            "title": f"Copy of {original_note.title or original_note.auto_generate_title()}",
            "blocks": original_note.blocks,
            "category": original_note.category,
            "priority_level": original_note.priority_level,
            "custom_tags": (
                original_note.custom_tags[:] if original_note.custom_tags else []
            ),
            "project": original_note.project,
        }

        serializer = NoteSerializer(data=duplicate_data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        duplicate_note = serializer.save()

        return Response(
            {
                "original_note_id": original_note.id,
                "duplicate_note": NoteSerializer(
                    duplicate_note, context={"request": request}
                ).data,
                "message": f"Note duplicated successfully as '{duplicate_note.title}'",
            },
            status=status.HTTP_201_CREATED,
        )
