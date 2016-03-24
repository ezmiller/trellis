# from .models import Link, Topic
from .blueprint import trellis_bp
from .models import *  # noqa
from .views import *  # noqa


def init_app(app):

    app.register_blueprint(trellis_bp)
