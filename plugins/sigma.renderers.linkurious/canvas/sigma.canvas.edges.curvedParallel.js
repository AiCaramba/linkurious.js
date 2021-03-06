;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * This edge renderer will display edges as curves.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.curvedParallel = function(edge, source, target, context, settings) {
    var color = edge.active ?
          edge.active_color || settings('defaultEdgeActiveColor') :
          edge.color,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        level = edge.active ? settings('edgeActiveLevel') : edge.level,
        cp = {},
        cp1 = {},
        cp2 = {},
        sSize = source[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        c,
        d,
        dist = sigma.utils.getDistance(sX, sY, tX, tY);

    // Intersection points of the source node circle:
    c = sigma.utils.getCircleIntersection(sX, sY, size, tX, tY, dist);

    // Intersection points of the target node circle:
    d = sigma.utils.getCircleIntersection(tX, tY, size, sX, sY, dist);

    context.save();

    cp1 = (source.id === target.id) ?
      sigma.utils.getSelfLoopControlPoints(c.xi, c.yi, sSize, edge.cc) :
      sigma.utils.getQuadraticControlPoint(c.xi, c.yi, d.xi_prime, d.yi_prime, edge.cc);

    cp2 = (source.id === target.id) ?
      sigma.utils.getSelfLoopControlPoints(c.xi_prime, c.yi_prime, sSize, edge.cc) :
      sigma.utils.getQuadraticControlPoint(c.xi_prime, c.yi_prime, d.xi, d.yi, edge.cc);


    cp = (source.id === target.id) ?
      sigma.utils.getSelfLoopControlPoints(sX, sY, sSize, edge.cc) :
      sigma.utils.getQuadraticControlPoint(sX, sY, tX, tY, edge.cc);


    // Level:
    if (level) {
      context.shadowOffsetX = 0;
      // inspired by Material Design shadows, level from 1 to 5:
      switch(level) {
        case 1:
          context.shadowOffsetY = 1.5;
          context.shadowBlur = 4;
          context.shadowColor = 'rgba(0,0,0,0.36)';
          break;
        case 2:
          context.shadowOffsetY = 3;
          context.shadowBlur = 12;
          context.shadowColor = 'rgba(0,0,0,0.39)';
          break;
        case 3:
          context.shadowOffsetY = 6;
          context.shadowBlur = 12;
          context.shadowColor = 'rgba(0,0,0,0.42)';
          break;
        case 4:
          context.shadowOffsetY = 10;
          context.shadowBlur = 20;
          context.shadowColor = 'rgba(0,0,0,0.47)';
          break;
        case 5:
          context.shadowOffsetY = 15;
          context.shadowBlur = 24;
          context.shadowColor = 'rgba(0,0,0,0.52)';
          break;
      }
    }

    if (!color)
      switch (edgeColor) {
        case 'source':
          color = source.color || defaultNodeColor;
          break;
        case 'target':
          color = target.color || defaultNodeColor;
          break;
        default:
          color = defaultEdgeColor;
          break;
      }

    if (edge.active) {
      context.strokeStyle = settings('edgeActiveColor') === 'edge' ?
        (color || defaultEdgeColor) :
        settings('defaultEdgeActiveColor');
    }
    else {
      context.strokeStyle = color;
    }


    context.lineWidth = size;
    context.beginPath();
    context.moveTo(c.xi, c.yi);
    if (source.id === target.id) {
      context.bezierCurveTo(cp1.x1, cp1.y1, cp1.x2, cp1.y2, d.xi_prime, d.yi_prime);
    } else {
      context.quadraticCurveTo(cp1.x, cp1.y, d.xi_prime, d.yi_prime);
    }
    context.stroke();

    context.beginPath();
    context.moveTo(c.xi_prime, c.yi_prime);
    if (source.id === target.id) {
      context.bezierCurveTo(cp2.x1, cp2.y1, cp2.x2, cp2.y2, d.xi, d.yi);
    } else {
      context.quadraticCurveTo(cp2.x, cp2.y, d.xi, d.yi);
    }
    context.stroke();

    // reset shadow
    if (level) {
      context.shadowOffsetY = 0;
      context.shadowBlur = 0;
      context.shadowColor = '#000000'
    }
  };

})();
