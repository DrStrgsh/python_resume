import importlib
import pkgutil
from collections.abc import Iterator

from tests.factories.base import BaseFactory


def import_all_factory_modules() -> None:
    import tests.factories

    package = tests.factories
    for _, module_name, _ in pkgutil.walk_packages(
        package.__path__, package.__name__ + "."
    ):
        importlib.import_module(module_name)


def iter_all_subclasses(cls: type) -> Iterator[type]:
    for sub in cls.__subclasses__():
        yield sub
        yield from iter_all_subclasses(sub)


def bind_sqlalchemy_session_to_all_factories(session) -> None:
    import_all_factory_modules()

    for factory_cls in iter_all_subclasses(BaseFactory):
        factory_cls._meta.sqlalchemy_session = session
