from django.db import models

class Drug(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=255, blank=True)
    presentation = models.CharField(max_length=255, blank=True)

    # Dosing Info
    adult_dose = models.TextField(blank=True)
    pediatric_dose = models.TextField(blank=True)
    is_pediatric = models.BooleanField(default=False)

    max_dose = models.CharField(max_length=255, blank=True)
    frequency = models.CharField(max_length=255, blank=True)

    # Safety
    warnings = models.TextField(blank=True)
    contraindications = models.TextField(blank=True)

    cat_liver = models.CharField(max_length=255, blank=True)
    cat_kidney = models.CharField(max_length=255, blank=True)
    cat_lactation = models.CharField(max_length=255, blank=True)
    cat_pregnancy = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name