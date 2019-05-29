from djongo import models


class Suggestion(models.Model):
    def __str__(self):
        return self.name
