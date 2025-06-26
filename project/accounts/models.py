from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'Utilisateur'),
        ('admin', 'Administrateur'),
    ]
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    join_date = models.DateField(auto_now_add=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    birth_date = models.DateField(blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        db_table = 'auth_user'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_admin(self):
        return self.role == 'admin'