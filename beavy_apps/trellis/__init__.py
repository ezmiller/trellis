from .blueprint import trellis_bp


def init_app(app):

    app.register_blueprint(trellis_bp)
