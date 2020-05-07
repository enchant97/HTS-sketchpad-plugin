"""
contains the blueprint stuff
"""
import base64
import os

from flask import (Blueprint, abort, current_app, jsonify, render_template,
                   request, send_file)
from flask_login import login_required

from ...database.database import db
from .models.sketchpad import Image

blueprint = Blueprint(
    "sketchpad", __name__,
    url_prefix="/sketchpad", template_folder="templates", static_folder="static")

@blueprint.route("/")
@login_required
def sketchpad():
    return render_template("sketchpad.html")

@blueprint.route("/sketch-image/<id_>")
@login_required
def get_sketch_img(id_):
    file_row = Image.query.filter_by(id_=id_).first()
    if file_row:
        filename = f"{file_row.id_}.png"
        fullpath = os.path.join(
            current_app.config["IMG_LOCATION"],
            "sketchpad",
            filename
            )
        return send_file(fullpath)
    return abort(404)

@blueprint.route("/view")
@login_required
def view():
    sketches = Image.query.filter_by(removed=False).all()
    return render_template("sketchpad-view.html", sketches=sketches)

@blueprint.route("/save", methods=["POST"])
@login_required
def save():
    the_json = request.json
    image_bytes = base64.b64decode(the_json["image"])

    # check if image saving is enabled
    if current_app.config["IMG_LOCATION"]:
        # get the image id from newly created row
        image_row = Image()
        db.session.add(image_row)
        db.session.commit()

        # generate the save path using the Image row's id for the name
        image_path = os.path.join(
            current_app.config["IMG_LOCATION"],
            "sketchpad",
            f"{image_row.id_}.{the_json['extention']}"
            )
        # make folder structure if it does not exist
        if not os.path.exists(os.path.dirname(image_path)):
            os.makedirs(os.path.dirname(image_path))
        # write the image to file
        with open(image_path, "wb") as fo:
            fo.write(image_bytes)
    else:
        return jsonify({"status": "error", "status-desc": "file uploads are currently disabled"})

    return jsonify({"status": "ok"})
