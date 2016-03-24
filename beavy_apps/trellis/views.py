from flask import request, abort
from beavy.app import db, current_user
from beavy.utils import fallbackRender
from flask.ext.security import login_required

from .blueprint import trellis_bp
from .models import Topic, Link
from .schemas import topic as topic_schema, link as link_schema


@trellis_bp.route("/submit/", methods=["GET", "POST"])
@fallbackRender('trellis/submit.html')
@login_required
def submit_story():
    if request.method == "POST":
        params = request.get_json()
        title, url = params['title'].strip(), params['url'].strip()
        text = params.get('text', "").strip()
        if not title:
            return abort(400, "You have to provide a 'title'")

        if url:
            link = Link(title=title, url=url, owner_id=current_user.id)
            db.session.add(link)
            db.session.commit()
            return link_schema.dump(link)
        elif text:
            topic = Topic(title=title, text=text, owner_id=current_user.id)
            db.session.add(topic)
            db.session.commit()
            return topic_schema.dump(topic)

        return abort(400, "You have to provide either 'url' or 'text', too")

    # Just render it
    return {}
