# Django/DRF Import Linting Configuration

## Overview
The `bashvilleapi/` directory contains **template files** for Django backend implementation. These files will show linting errors in this React frontend repository because Django and Django REST Framework are not installed here.

## Expected Linting Errors

### ❌ These errors are EXPECTED and can be ignored:

**Django Core Imports:**
```python
Import "django.db" could not be resolved from source
Import "django.db.models" could not be resolved from source  
Import "django.contrib.auth.models" could not be resolved from source
Import "django.utils" could not be resolved from source
Import "django.utils.timezone" could not be resolved from source
```

**Django REST Framework Imports:**
```python
Import "rest_framework" could not be resolved
Import "rest_framework.decorators" could not be resolved
Import "rest_framework.response" could not be resolved
Import "rest_framework.permissions" could not be resolved
Import "rest_framework.serializers" could not be resolved
```

## ✅ Resolution

These errors will automatically resolve when the template files are copied to your Django backend project where Django and DRF are properly installed.

## VSCode/Pylance Configuration

To suppress these errors in this frontend repository, you can:

### Option 1: Add to VSCode settings.json
```json
{
  "python.analysis.ignore": [
    "**/bashvilleapi/**"
  ]
}
```

### Option 2: Add to .vscode/settings.json
```json
{
  "pylint.args": [
    "--disable=import-error",
    "--ignore=bashvilleapi"
  ],
  "python.linting.pylintArgs": [
    "--disable=import-error",
    "--ignore=bashvilleapi"
  ]
}
```

### Option 3: Individual File Suppression
Add to the top of each template file:
```python
# pylint: disable=import-error
# type: ignore
```

## 🎯 Action Items for Server-Side Implementation

When implementing in your Django backend:

1. **Verify Django Installation:**
   ```bash
   pip install django djangorestframework
   ```

2. **Check INSTALLED_APPS:**
   ```python
   INSTALLED_APPS = [
       'rest_framework',
       'bashvilleapi',
       # ... other apps
   ]
   ```

3. **Test Imports:**
   ```python
   # These should work without errors in Django project
   from django.db import models
   from rest_framework import viewsets
   ```

4. **If Import Errors Persist:**
   - Check Python virtual environment activation
   - Verify Django project structure
   - Check Python path configuration
   - Ensure proper package installation

## 📋 Checklist for Clean Implementation

- [ ] Copy template files to Django backend project
- [ ] Install Django and DRF in backend environment  
- [ ] Update `__init__.py` files with new imports
- [ ] Run `python manage.py check` to verify no real errors
- [ ] Generate migrations with `python manage.py makemigrations`
- [ ] Apply migrations with `python manage.py migrate`
- [ ] Test API endpoints with proper authentication

The linting errors in this frontend repository are cosmetic and will not affect the actual Django implementation.