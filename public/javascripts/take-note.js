var updateTimeInterval;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('lecture_link', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    const takeNoteButton = document.querySelector('.take_note');

    if (updateTimeInterval) {
        clearInterval(updateTimeInterval);
    }

    updateTimeInterval = setInterval(() => {
        if (player && typeof player.getCurrentTime === 'function') {
            const seconds = player.getCurrentTime();
            const formattedTime = new Date(seconds * 1000).toISOString().substr(11, 8);
            document.getElementById('noteTime').textContent = `Take note ${formattedTime}`;
        }
    }, 1000);

    takeNoteButton.addEventListener('click', function (event) {
        event.preventDefault();
        player.pauseVideo();
        const currentTime = player.getCurrentTime();
        const formattedTime = new Date(currentTime * 1000).toISOString().substr(11, 8);
        console.log("Time: " + formattedTime);
        showNoteModal(formattedTime);
    });
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        console.log('Video is playing');
    } else if (event.data == YT.PlayerState.PAUSED) {
        console.log('Video is paused');
    } else if (event.data == YT.PlayerState.ENDED) {
        console.log('Video has ended');
    }
}

function showNoteModal(time) {
    const modalHTML = `
      <div class="modal fade" id="noteModal" tabindex="-1" aria-labelledby="noteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="noteModalLabel">Take note at ${time}</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <textarea id="noteText" class="form-control" placeholder="Enter your note here"></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" onclick="saveNote('${time}')">Save Note</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    $('#noteModal').modal('show');

    $('#noteModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

function saveNote(time) {
    const noteDescription = document.getElementById('noteText').value;
    const lectureID = document.getElementById('lectureId').value;

    console.log(`Note at ${time}: ${noteDescription}`);

    $.ajax({
        url: '/home/take-note',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            lectureID,
            noteTimeStamp: time,
            noteDescription
        }),
        success: function(response) {
            console.log('Note saved:', response);
            $('#noteModal').modal('hide');
            updateNotesList();
        },
        error: function(xhr, status, error) {
            console.error('Error saving note:', error);
        }
    });
}

function getYouTubeVideoID(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\s*[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

function jumpToLecture(lectureID, noteTimeStamp, lectureTitle, lectureLink, lectureDescription) {
    change_lecture(lectureID, lectureTitle, lectureLink, lectureDescription);

    function seekAndPlay() {
        if (player && typeof player.seekTo === 'function' && player.getPlayerState() > 0) {
            const timeInSeconds = hmsToSeconds(noteTimeStamp);
            player.seekTo(timeInSeconds, true);
            player.playVideo();
        } else {
            // Wait for the player to be ready
            setTimeout(seekAndPlay, 500);
        }
    }

    seekAndPlay();
}

function hmsToSeconds(hms) {
    var a = hms.split(':');
    // Convert HH:MM:SS to seconds
    var seconds = (+a[0]) * 3600 + (+a[1]) * 60 + (+a[2]); 
    return seconds;
}
