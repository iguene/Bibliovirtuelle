from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_active', 'join_date')
    list_filter = ('role', 'is_active', 'join_date')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations personnelles', {
            'fields': ('role', 'avatar', 'phone', 'address', 'birth_date')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Informations personnelles', {
            'fields': ('email', 'first_name', 'last_name', 'role')
        }),
    )