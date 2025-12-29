"""add user role enum

Revision ID: aa02819124c6
Revises: 61890f1c70fe
Create Date: 2025-12-30 00:57:12.101138

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa02819124c6'
down_revision: Union[str, Sequence[str], None] = '61890f1c70fe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

user_role_enum = sa.Enum("admin", "user", name="user_role")

def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    user_role_enum.create(bind, checkfirst=True)
    op.add_column("users", sa.Column("role", user_role_enum, nullable=True))
    try:
        op.execute("UPDATE users SET role = 'admin' WHERE is_admin = true")
        op.execute("UPDATE users SET role = 'user' WHERE is_admin = false")
    except Exception:
        op.execute("UPDATE users SET role = 'user' WHERE role IS NULL")

    op.alter_column("users", "role", existing_type=user_role_enum, nullable=False)

def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    op.drop_column('users', 'role')
    user_role_enum.drop(bind, checkfirst=True)