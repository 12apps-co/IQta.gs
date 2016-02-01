Package.describe({
	name: 'franciskim:instagram-fetcher',
	version: '0.2.1',
	summary: 'Fetching images from the Instagram API. Very early version.',
	git: 'https://github.com/franciskim/meteor-instagram-fetcher'
});

Package.onUse(function ( api ) {

	// Set versions from.
  api.versionsFrom('METEOR@0.9.0');

	api.use([
		'http',
		'check'
	], 'server');

	api.addFiles([
		'instagram-fetcher.js',
		], 'server');

	api.export('InstagramFetcher');

});

Package.onTest(function (api) {

	api.use(['tinytest', 'franciskim:instagram-fetcher'], ['server']);
	api.addFiles('tests/tests.js', 'server');

});
