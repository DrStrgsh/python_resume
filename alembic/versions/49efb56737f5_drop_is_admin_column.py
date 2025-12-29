"""drop is_admin column

Revision ID: 49efb56737f5
Revises: aa02819124c6
Create Date: 2025-12-30 01:25:27.183693

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '49efb56737f5'
down_revision: Union[str, Sequence[str], None] = 'aa02819124c6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column("users", "is_admin")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column("users", sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.text("false")))
