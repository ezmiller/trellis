from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand

from flask_environments import Environments

from .utils import load_modules

import os

app = Flask(__name__)
env = Environments(app, var_name="BEAVY_ENV")

env.from_yaml(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.yml'))
env.from_yaml(os.path.join(os.getcwd(), 'config.yml'))

db = SQLAlchemy(app)
migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

load_modules(app)
