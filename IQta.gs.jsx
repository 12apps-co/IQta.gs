if (Meteor.isClient) {
    selectedTags = [];
    Meteor.startup(function () {
        // Use Meteor.startup to render the component after the page is ready
        React.render(<App />, document.getElementById("render-target"));
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
    Meteor.methods({
        search: function (searchString) {
            var searchString = searchString.toLowerCase();
            var options = {
                tagName: searchString
            };
            // search for tags containing variable tag
            var result = InstagramFetcher.tagsSearch(options);
            var tags = [];
            // add the searched hashtag first as some unicode searches don't return this
            tags.push({
                text: searchString,
                score: 9999999999
            });
            // format our search result and push if it doesn't already exist
            result.data.data.forEach(function (item) {
                var toPush = true;
                tags.forEach(function (tag) {
                    if (item.name === tag.text) toPush = false;
                });
                if (toPush) {
                    tags.push({
                        text: item.name,
                        score: item.media_count
                    });
                }
            });
            // sort it from highest score to lowest
            tags.sort(function (a, b) {
                return parseFloat(b.score) - parseFloat(a.score);
            });
            tags.forEach(function (tag, i) {
                tags[i].score = (tags.length - i) * 250; // normalise score
                // find any year at the end of tag and replace with current year
                if (tags[i].text.match('[12][kK0-9][0-9]{2}$')) {
                    var newText = tags[i].text.replace(/[12][kK0-9][0-9]{2}$/, '2016');
                    if (JSON.stringify(tags).indexOf('"' + newText + '"') === -1) {
                        tags[i].text = newText;
                    }
                    else {
                        tags.forEach(function (t, i) {
                            if (t.text === newText) {
                                tags[i].score = tags[i].score + tag.score;
                            }
                        });
                        tags.splice(i, 1);
                    }
                }
            });
            // do another search for recent images with the tag, and retrieve likes & tags
            var result = InstagramFetcher.fetchImages.fromTag(options);
            result.data.data.forEach(function (item) {
                var likes = item.likes.count + 1;
                item.tags.forEach(function (text) {
                    var obj = {
                        text: text,
                        score: likes
                    };
                    // scoring algo
                    var exists = false;
                    tags.forEach(function (t, i) {
                        if (checkForValue(t, text)) {
                            exists = true;
                            tags[i].score = tags[i].score + (likes * 2.5);
                        }
                    });
                    if (!exists) tags.push(obj);
                })
            });
            // sort it from highest score to lowest
            tags.sort(function (a, b) {
                return parseFloat(b.score) - parseFloat(a.score);
            });
            // return the prettily formatted tags
            return tags;
        }
    })
}

function checkForValue(json, value) {
    for (key in json) {
        if (typeof (json[key]) === "object") {
            return checkForValue(json[key], value);
        } else if (json[key] === value) {
            return true;
        }
    }
    return false;
}