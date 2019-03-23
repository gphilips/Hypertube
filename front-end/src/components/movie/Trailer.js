import React from 'react';
import {Helmet} from "react-helmet";
import { VideoBackground, VideoForeground, IframeYoutube } from "../../style/youtubePlayer";

export default class Trailer extends React.Component {
    render() {
        let src = new URL("https://www.youtube.com/embed/" + this.props.trailerId + "?rel=0&amp;controls=0&amp;showinfo=0;autoplay=1&iv_load_policy=3&loop=1&playlist=" + this.props.trailerId);
        let activePlayer = this.props.activePlayer;
        return (
            !activePlayer &&
            <div>
                <Helmet>
                    <style>{"body { background-color: #000 }"}</style>
                </Helmet>
                <VideoBackground id="popupVid">
                    <VideoForeground>
                        <IframeYoutube
                            allow="autoplay; encrypted-media"
                            title={this.props.trailerId}
                            id="ytplayer"
                            type="text/html"
                            src={src}
                            frameBorder="0"
                        />
                    </VideoForeground> 
                </VideoBackground>
            </div>
        )
    }
}