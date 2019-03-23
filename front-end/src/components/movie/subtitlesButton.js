import PropTypes from "prop-types";
import React, { Component } from "react";

const propTypes = {
  player: PropTypes.object,
  className: PropTypes.string
};

export default class SubtitlesButton extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let video = this.props.video;
    let videoContainer = document.getElementsByClassName(
      "video-react-control-bar"
    );
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = "hidden";
    }
    var subtitleMenuButtons = [];
    var createMenuItem = function(id, lang, label) {
      var listItem = document.createElement("li");
      var button = listItem.appendChild(document.createElement("button"));
      button.setAttribute("id", id);
      button.className = "subtitles-button";
      if (lang.length > 0) button.setAttribute("lang", lang);
      button.value = label;
      button.setAttribute("data-state", "inactive");
      button.appendChild(document.createTextNode(label));
      button.addEventListener("click", function(e) {
        subtitleMenuButtons.map((v, i, a) =>
          subtitleMenuButtons[i].setAttribute("data-state", "inactive")
        );

        var lang = this.getAttribute("lang");
        for (var i = 0; i < video.textTracks.length; i++) {
          if (video.textTracks[i].language === lang) {
            video.textTracks[i].mode = "showing";
            this.setAttribute("data-state", "active");
          } else {
            video.textTracks[i].mode = "hidden";
          }
        }
        subtitlesMenu.style.display = "none";
      });
      subtitleMenuButtons.push(button);
      return listItem;
    };
    let subtitlesMenu1 = document.getElementsByClassName("subtitles-menu");
    if (video.textTracks && subtitlesMenu1.length === 0) {
      var df = document.createDocumentFragment();
      var subtitlesMenu = df.appendChild(document.createElement("ul"));
      subtitlesMenu.className = "subtitles-menu";
      subtitlesMenu.appendChild(createMenuItem("subtitles-off", "", "Off"));
      for (var i = 0; i < video.textTracks.length; i++) {
        if (video.textTracks[i].label) {
          subtitlesMenu.appendChild(
            createMenuItem(
              "subtitles-" + video.textTracks[i].language,
              video.textTracks[i].language,
              video.textTracks[i].label
            )
          );
        }
      }

      subtitlesMenu.style.display = "none";
      videoContainer[0].appendChild(subtitlesMenu);
    }
    subtitlesMenu1 = document.getElementsByClassName("subtitles-menu");
    if (subtitlesMenu1) {
      subtitlesMenu1[0].style.display === "block"
        ? (subtitlesMenu1[0].style.display = "none")
        : (subtitlesMenu1[0].style.display = "block");
    }
  }

  render() {
    return (
      <button
        id="subtitles"
        type="button"
        data-state="subtitles"
        onClick={this.handleClick}
      >
        CC
      </button>
    );
  }
}

SubtitlesButton.propTypes = propTypes;
