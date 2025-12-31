import csv
import os
from django.core.management.base import BaseCommand
from django.conf import settings

from PharmaGo.models import Drug


class Command(BaseCommand):
    """
    Import both pediatric and adult CSV sources into the same Drug table.
    Adult rows are flagged with is_pediatric=False so the frontend can filter them.
    """

    help = "Imports drugs from pediatrics_full_text.csv and adult.csv"

    CSV_SOURCES = [
        ("PharmaGo/DB/pediatrics_full_text.csv", None),  # already contains drug.pediatric column
        ("PharmaGo/DB/adult.csv", False),                # force adult rows
    ]

    def handle(self, *args, **kwargs):
        total = 0
        skipped = 0
        errors = 0

        for relative_path, forced_flag in self.CSV_SOURCES:
            file_path = os.path.join(settings.BASE_DIR, relative_path)

            if not os.path.exists(file_path):
                self.stdout.write(self.style.WARNING(f"File not found: {file_path}"))
                continue

            self.stdout.write(f"Importing {file_path} ...")

            with open(file_path, "r", encoding="utf-8", newline="") as file:
                reader = csv.DictReader(file)

                for row in reader:
                    name_value = (row.get("name") or "").strip()
                    if not name_value:
                        skipped += 1
                        continue

                    # Determine pediatric flag
                    if forced_flag is not None:
                        is_peds = forced_flag
                    else:
                        raw_flag = (row.get("is_pediatric") or row.get("drug.pediatric") or "").strip().lower()
                        is_peds = raw_flag in ("true", "yes", "y", "1")

                    standard_dose = (row.get("drug.standard_dose") or "").strip()
                    adult_dose = (row.get("adult_dose") or "").strip()
                    pediatric_dose = (row.get("pediatric_dose") or "").strip()

                    if is_peds:
                        if not pediatric_dose:
                            pediatric_dose = standard_dose
                    else:
                        if not adult_dose:
                            adult_dose = standard_dose

                    defaults = {
                        "category": (row.get("drug_type") or "").strip(),
                        "presentation": (row.get("drug.administration_route") or "").strip(),
                        "adult_dose": adult_dose,
                        "pediatric_dose": pediatric_dose,
                        "max_dose": (row.get("drug.max_dose") or "").strip(),
                        "frequency": (row.get("drug.dose_frequency") or "").strip(),
                        "warnings": (row.get("drug.adverse_effects") or "").strip(),
                        "contraindications": (row.get("drug.contraindications") or "").strip(),
                        "cat_pregnancy": (row.get("cat_pregnancy") or "").strip(),
                        "cat_lactation": (row.get("cat_lactation") or "").strip(),
                        "cat_liver": (row.get("cat_liver") or "").strip(),
                        "cat_kidney": (row.get("cat_kidney") or "").strip(),
                        "is_pediatric": is_peds,
                    }

                    try:
                        Drug.objects.update_or_create(name=name_value, defaults=defaults)
                        total += 1
                    except Exception as exc:
                        errors += 1
                        self.stdout.write(self.style.WARNING(f'Error importing "{name_value}": {exc}'))

        self.stdout.write(self.style.SUCCESS(
            f"Import completed. Added/updated: {total}, skipped: {skipped}, errors: {errors}"
        ))



