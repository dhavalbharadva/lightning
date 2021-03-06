lightning.video = {

    players: {},

    /**
     * Prepare the video.
     */
    init: function() {
        var self = this;
        for (var i in lightning.vars.videos) {
            var video = lightning.vars.videos[i];
            if (!video.call) {
                video.call = [];
            }
            if (video.playlist) {
                var ul = $('<ul>');
                for (var j in video.playlist) {
                    ul.append('<li id="video_link_' + i + '_' + j + '">' + video.playlist[j].title + '</li>');
                }
                $('#video_playlist_' + i).html(ul).on('click', 'ul', this.clickPlaylist);
            }
            if (video.call.beforeLoad) {
                lightning.getMethodReference(video.call.beforeLoad)(i, function(){
                    self.load(i);
                });
            } else {
                this.load(i);
            }
        }
    },

    clickPlaylist: function(event) {
        var div_id = event.target.id.replace('video_link_', '');
        var playlist_id = div_id.match(/[0-9]+$/);
        var video_id = div_id.replace('_' + playlist_id, '');
        lightning.video.players[video_id].dispose();
        lightning.video.load(video_id, playlist_id, true)
    },

    /**
     * Build the video HTML.
     */
    load: function(id, playlist_id, force_autoplay) {
        var video = lightning.vars.videos[id];
        var container = $('#video_' + id);
        if (!playlist_id) {
            playlist_id = 0;
        }
        var source = video.playlist ? video.playlist[playlist_id] : video;
        var showControls = source.controls || !source.hasOwnProperty('controls') && (!video.hasOwnProperty('controls') || video.controls);
        if (source.mp4 || source.ogg || source.webm) {
            var video_tag = '<video id=video_player_' + id + ' class="video-js vjs-default-skin" width="640" height="360" poster="' + (source.still ? source.still : video.still ? video.still : '') + '" ' + (showControls ? 'controls' : '') + ' preload>';
            for (var codec in {'mp4': 1, 'ogg': 1, 'webm': 1}) {
                if (source[codec]) {
                    video_tag += '<source src="' + source[codec] + '" type="video/' + codec + ';">';
                }
            }
            video_tag += '</video>';
        } else {
            var video_tag = '<audio id=video_player_' + id + ' class="video-js vjs-default-skin" width="640" height="360"' + (showControls ? 'controls' : '') + ' preload>';
            for (var codec in {'mp3': 1}) {
                if (source[codec]) {
                    video_tag += '<source src="' + source[codec] + '" type="audio/' + codec + ';">';
                }
            }
            video_tag += '</audio>';
        }
        container.append(video_tag);

        // Initialize the player.
        videojs.autoSetup();
        this.players[id] = videojs(
            document.getElementById('video_player_' + id),
            {
                width: '100%',
                controls: showControls
            }
        );

        if (video.classes) {
            $('#video_player_' + id).addClass(video.classes);
        }

        // Start playing.
        if (video.autoPlay || force_autoplay) {
            this.players[id].play();
            // Jump to the start time.
            if (video.startTime && video.startTime > 0) {
                this.players[id].currentTime(video.startTime);
            }
            if (video.call.afterLoad) {
                this.players[id].one('play', video.call.afterLoad);
            }
        }

        if (video.call.onEnd) {
            this.players[id].on('ended', lightning.getMethodReference(video.call.onEnd));
        }

        if (video.call.onTime) {
            var self = this;
            this.players[id].on('timeupdate', function(){
                self.timeCallback(self.players[id], lightning.vars.videos[id].call.onTime);
            })
        }
    },

    timeCallback: function(video, events) {
        var time = video.currentTime()
        for (var triggerTime in events) {
            if (time >= triggerTime) {
                lightning.getMethodReference(events[triggerTime])();
                delete events[triggerTime];
            }
        }
    }
};
