from flask import Blueprint

trellis_bp = Blueprint('trellis', __name__,
                       template_folder='templates')
