import factory

from app.models.technologies import Technology

from .base import BaseFactory


class TechnologyFactory(BaseFactory):
    class Meta:
        model = Technology

    name = factory.sequence(lambda n: f"tech-{n}")
    start_year = factory.sequence(lambda n: 0 + n)
