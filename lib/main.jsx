popularTags = {}

Meteor.startup(function () {
    // code to run on server at startup)
    Meteor.call('popular', 'eng', function (error, result) {
        if (error) console.error(error)
        else if (result) {
            popularTags.eng = result.data
        }
    })
    Meteor.call('popular', 'kor', function (error, result) {
        if (error) console.error(error)
        else if (result) {
            popularTags.kor = result.data
        }
    })
})