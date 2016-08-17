Meteor.startup(function () {
    // code to run on server at startup
})

Meteor.methods({
    search: function (string) {
        let searchString = string.toLowerCase();
        let options = {
            tagName: searchString
        }
        // search for tags containing variable tag
        let result = HTTP.call('GET', 'https://www.instagram.com/web/search/topsearch/?context=blended&query=%23' + searchString + '&rank_token=0.13514518676593723', {})
        result = result.data.hashtags
        let tags = []
        // add the searched hashtag first as some unicode searches don't return this
        tags.push({
            text: searchString,
            score: 9999999999
        })
        console.log(typeof result)
        // format our search result and push if it doesn't already exist
        if (typeof result === 'object') {
            result.forEach(function (item) {
                let toPush = true
                tags.forEach(function (tag) {
                    if (item.hashtag.name === tag.text) toPush = false // do not add duplicates
                })
                if (toPush) {
                    tags.push({
                        text: item.hashtag.name,
                        score: item.hashtag.media_count
                    })
                }
            })
        }
        // sort it from highest score to lowest
        tags.sort(function (a, b) {
            return parseFloat(b.score) - parseFloat(a.score);
        })

        tags.forEach(function (tag, i) {
            tags[i].score = (tags.length - i) * 250 // normalise score
            // find any year at the end of tag and replace with current year
            if (tags[i].text.match('[12][kK0-9][0-9]{2}$')) {
                let newText = tags[i].text.replace(/[12][kK0-9][0-9]{2}$/, '2016')
                if (JSON.stringify(tags).indexOf('"' + newText + '"') === -1) {
                    tags[i].text = newText
                }
                else {
                    tags.forEach(function (t, i) {
                        if (t.text === newText) {
                            tags[i].score = tags[i].score + tag.score;
                        }
                    })
                    tags.splice(i, 1)
                }
            }
        })

        result = HTTP.call('GET', 'http://localhost:3333/search/' + searchString)
        if (result && result.length > 0) {
            result.related.forEach((tag) => {
                let tag = {
                    text: tag.hashtag,
                    score: tag.score * 100
                }
                let exists = false
                tags.forEach((t, i) => {
                    if (checkForValue(t, tag.hashtag)) {
                        exists = true
                        tags[i].score = tags[i].score + (tag.score * 100)
                    }
                })
                if (!exists) tags.push(tag)
            })
        }
        //
        //// do another search for recent images with the tag, and retrieve likes & tags
        ////let result = InstagramFetcher.fetchImages.fromTag(options);
        //result.data.data.forEach(function (item) {
        //    let likes = item.likes.count + 1;
        //    item.tags.forEach(function (text) {
        //        let obj = {
        //            text: text,
        //            score: likes
        //        };
        //        // scoring algo
        //        let exists = false;
        //        tags.forEach(function (t, i) {
        //            if (checkForValue(t, text)) {
        //                exists = true;
        //                tags[i].score = tags[i].score + (likes * 2.5);
        //            }
        //        });
        //        if (!exists) tags.push(obj);
        //    })
        //});
        // sort it from highest score to lowest
        tags.sort(function (a, b) {
            return parseFloat(b.score) - parseFloat(a.score)
        })
        // return the prettily formatted tags
        return tags
    }
})

function checkForValue(json, value) {
    for (key in json) {
        if (typeof (json[key]) === "object") {
            return checkForValue(json[key], value)
        } else if (json[key] === value) {
            return true
        }
    }
    return false
}