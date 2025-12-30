import factory

from app.core.security import hash_password
from app.models.enums import UserRole
from app.models.users import User

from .base import BaseFactory


class UserFactory(BaseFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    password_hash = factory.LazyFunction(lambda: hash_password("password"))
    role = UserRole.user


class AdminFactory(UserFactory):
    role = UserRole.admin
    username = factory.Sequence(lambda n: f"admin{n}")
