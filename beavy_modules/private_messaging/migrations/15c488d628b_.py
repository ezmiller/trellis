"""empty message

Revision ID: 15c488d628b
Revises: 1d461753b2e
Create Date: 2015-09-17 18:22:53.615421

"""

# revision identifiers, used by Alembic.
revision = '15c488d628b'
down_revision = None
depends_on = '1d461753b2e'

# add this here in order to use revision with branch_label
branch_labels = ('beavy.private_messaging', )

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('private_message_participants',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('pm_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['pm_id'], ['objects.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    op.add_column('objects', sa.Column('title', sa.String(length=255), nullable=False))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('objects', 'title')
    op.drop_table('private_message_participants')
    ### end Alembic commands ###
