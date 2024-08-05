import SentryCli from '@sentry/cli';

(async function () {
  const release = process.env.NEXT_PUBLIC_SENTRY_RELEASE || '';

  const cli = new SentryCli();

  try {
    console.log('Now creating sentry release ' + release);

    await cli.releases.new(release);

    // * Uploading source maps
    await cli.releases.uploadSourceMaps(release, {
      urlPrefix: '~/static/js',
      include: ['sourceMap'],
      rewrite: true,
    });

    console.log('Releasing release to Sentry');

    await cli.releases.finalize(release);
  } catch (e) {
    console.error('Source maps uploading failed:', e);
  }
})();
