from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import date, timedelta

User = get_user_model()

class Author(models.Model):
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    biography = models.TextField(blank=True, verbose_name="Biographie")
    birth_date = models.DateField(blank=True, null=True, verbose_name="Date de naissance")
    death_date = models.DateField(blank=True, null=True, verbose_name="Date de décès")
    nationality = models.CharField(max_length=100, blank=True, verbose_name="Nationalité")
    photo = models.ImageField(upload_to='authors/', blank=True, null=True, verbose_name="Photo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'library_author'
        verbose_name = 'Auteur'
        verbose_name_plural = 'Auteurs'
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        if self.birth_date:
            end_date = self.death_date or date.today()
            return end_date.year - self.birth_date.year
        return None

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
    description = models.TextField(blank=True, verbose_name="Description")
    color = models.CharField(max_length=7, default='#3B82F6', verbose_name="Couleur")
    
    class Meta:
        db_table = 'library_category'
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Publisher(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nom")
    address = models.TextField(blank=True, verbose_name="Adresse")
    website = models.URLField(blank=True, verbose_name="Site web")
    email = models.EmailField(blank=True, verbose_name="Email")
    
    class Meta:
        db_table = 'library_publisher'
        verbose_name = 'Éditeur'
        verbose_name_plural = 'Éditeurs'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Book(models.Model):
    STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('borrowed', 'Emprunté'),
        ('reserved', 'Réservé'),
        ('maintenance', 'En maintenance'),
        ('lost', 'Perdu'),
    ]
    
    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('en', 'Anglais'),
        ('es', 'Espagnol'),
        ('de', 'Allemand'),
        ('it', 'Italien'),
        ('pt', 'Portugais'),
        ('other', 'Autre'),
    ]
    
    title = models.CharField(max_length=300, verbose_name="Titre")
    subtitle = models.CharField(max_length=300, blank=True, verbose_name="Sous-titre")
    isbn = models.CharField(max_length=17, unique=True, verbose_name="ISBN")
    description = models.TextField(verbose_name="Description")
    publish_date = models.DateField(verbose_name="Date de publication")
    pages = models.PositiveIntegerField(validators=[MinValueValidator(1)], verbose_name="Nombre de pages")
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='fr', verbose_name="Langue")
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True, verbose_name="Image de couverture")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available', verbose_name="Statut")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Quantité")
    available_quantity = models.PositiveIntegerField(default=1, verbose_name="Quantité disponible")
    
    # Relations Many-to-Many
    authors = models.ManyToManyField(Author, related_name='books', verbose_name="Auteurs")
    categories = models.ManyToManyField(Category, related_name='books', verbose_name="Catégories")
    
    # Relations Foreign Key
    publisher = models.ForeignKey(Publisher, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Éditeur")
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_books')
    
    class Meta:
        db_table = 'library_book'
        verbose_name = 'Livre'
        verbose_name_plural = 'Livres'
        ordering = ['title']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['isbn']),
            models.Index(fields=['status']),
            models.Index(fields=['publish_date']),
        ]
    
    def __str__(self):
        return self.title
    
    @property
    def is_available(self):
        return self.status == 'available' and self.available_quantity > 0
    
    @property
    def authors_list(self):
        return ", ".join([author.full_name for author in self.authors.all()])
    
    @property
    def categories_list(self):
        return ", ".join([category.name for category in self.categories.all()])

class Loan(models.Model):
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('returned', 'Retourné'),
        ('overdue', 'En retard'),
        ('lost', 'Perdu'),
    ]
    
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='loans', verbose_name="Livre")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loans', verbose_name="Utilisateur")
    borrow_date = models.DateField(auto_now_add=True, verbose_name="Date d'emprunt")
    due_date = models.DateField(verbose_name="Date de retour prévue")
    return_date = models.DateField(blank=True, null=True, verbose_name="Date de retour effective")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="Statut")
    notes = models.TextField(blank=True, verbose_name="Notes")
    fine_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Montant de l'amende")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'library_loan'
        verbose_name = 'Emprunt'
        verbose_name_plural = 'Emprunts'
        ordering = ['-borrow_date']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['due_date']),
            models.Index(fields=['borrow_date']),
        ]
    
    def __str__(self):
        return f"{self.book.title} - {self.user.full_name}"
    
    @property
    def is_overdue(self):
        return self.status == 'active' and self.due_date < date.today()
    
    @property
    def days_overdue(self):
        if self.is_overdue:
            return (date.today() - self.due_date).days
        return 0
    
    def save(self, *args, **kwargs):
        if not self.due_date:
            self.due_date = date.today() + timedelta(days=30)
        
        # Mettre à jour le statut si en retard
        if self.status == 'active' and self.due_date < date.today():
            self.status = 'overdue'
        
        super().save(*args, **kwargs)

class Reservation(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('fulfilled', 'Satisfaite'),
        ('cancelled', 'Annulée'),
        ('expired', 'Expirée'),
    ]
    
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reservations', verbose_name="Livre")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations', verbose_name="Utilisateur")
    reservation_date = models.DateTimeField(auto_now_add=True, verbose_name="Date de réservation")
    expiry_date = models.DateTimeField(verbose_name="Date d'expiration")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="Statut")
    notified = models.BooleanField(default=False, verbose_name="Utilisateur notifié")
    
    class Meta:
        db_table = 'library_reservation'
        verbose_name = 'Réservation'
        verbose_name_plural = 'Réservations'
        ordering = ['reservation_date']
        unique_together = ['book', 'user', 'status']
    
    def __str__(self):
        return f"{self.book.title} - {self.user.full_name}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expiry_date

class Review(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]
    
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews', verbose_name="Livre")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews', verbose_name="Utilisateur")
    rating = models.IntegerField(choices=RATING_CHOICES, validators=[MinValueValidator(1), MaxValueValidator(5)], verbose_name="Note")
    comment = models.TextField(blank=True, verbose_name="Commentaire")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'library_review'
        verbose_name = 'Avis'
        verbose_name_plural = 'Avis'
        ordering = ['-created_at']
        unique_together = ['book', 'user']
    
    def __str__(self):
        return f"{self.book.title} - {self.user.full_name} ({self.rating}/5)"