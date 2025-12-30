import factory

from app.models.projects import Project
from .base import BaseFactory

class ProjectFactory(BaseFactory):
    class Meta:
        model = Project

    title = factory.Faker("sentence", nb_words = 3)
    slug = factory.Sequence(lambda n: f"project-{n}")
    description = factory.Faker("paragraph")
    url = factory.Faker("uri")
    repo_url = factory.Faker("uri")
    tags = factory.Faker("word")