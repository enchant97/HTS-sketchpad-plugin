"""
A very basic sketchpad plugin for
the Home Terminal System (HTS) made by enchant97
"""

__author__ = "enchant97 - Leo Spratt"
__version__ = "1.0.0"

# import the blueprint for use with the plugin loader
from .view import blueprint


class PluginData:
    """
    stores the plugins data,
    like the name and version
    and whether it has models to create
    """
    # name that will be used on nav buttons
    name = "Sketchpad"
    # your username and then the blueprint name
    unique_name = "enchant97.sketchpad"
    # the version of the plugin
    version = "1.0.0"
    # the version that the plugin was written for
    written_for_version = "3.5.5"
    # whether the plugins has a models folder to import
    has_models = True
    # the url_prefix copied here
    url_prefix = blueprint.url_prefix
