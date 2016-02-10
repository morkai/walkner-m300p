// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var step = require('h5.step');
var util = require('./util');

module.exports = function cleanUp(ctx, done)
{
  util.log('Cleaning up...');

  step(
    function delayCleanUpStep()
    {
      setTimeout(this.next(), 1);
    },
    function stopPreviewStep()
    {
      if (ctx.client && ctx.client.isOpen())
      {
        ctx.client.setFixPreview(0, 0, 0, 0, 0, 0, false, 0, this.next());
      }
    },
    function closeDeviceConnectionStep()
    {
      ctx.progress.complete('cleanup', 'stopPreview');

      if (ctx.client && ctx.client.isOpen())
      {
        ctx.client.once('closed', this.next());
        ctx.client.close();
      }
    },
    function closeBtConfStep()
    {
      ctx.progress.complete('cleanup', 'bt:close');

      if (ctx.btConf)
      {
        if (ctx.config.logging.conn)
        {
          util.log('[BtConf#closing]');
        }

        ctx.btConf.once('close', this.next());
        ctx.btConf.kill();
      }
    },
    function unpairDeviceStep()
    {
      ctx.progress.complete('cleanup', 'bt:kill');

      if (ctx.client)
      {
        ctx.client.unpair(this.next());
      }
    },
    function resetGlp2Step()
    {
      ctx.progress.complete('cleanup', 'bt:unpair');

      if (ctx.manager)
      {
        util.log('[glp2#resetting]');

        ctx.manager.reset(this.next());
      }
    },
    function stopGlp2Step()
    {
      ctx.progress.complete('cleanup', 'glp2:reset');

      if (ctx.manager)
      {
        util.log('[glp2#stopping]');

        ctx.manager.stop(this.next());
      }
    },
    function()
    {
      ctx.progress.complete('cleanup', 'glp2:stop');
    },
    done
  );
};
