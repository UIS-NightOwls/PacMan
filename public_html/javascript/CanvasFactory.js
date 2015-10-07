var CanvasFactory = (function(){

    var canvases = [];

    function createCanvas(v1,v2,v3,v4,v5){ /* v1 = width, v2 = height, v3 = scale, v4 = border, v5 = display */
        if(arguments.length !== 5){
            console.log("Please use function as follows (width,height,scale,border,display");
            return;
        }
        var cnv = document.createElement('canvas');
        cnv.width = v1;
        cnv.height = v2;
        cvn.scale = v3;
        var showBorder;
        if(typeof v4 === 'undefined' || v4 === false){
            showBorder = '';
        }else if(v4 === true){
            showBorder = 'border: solid thin;';
        }else if(v4.search('border') !== -1){
            showBorder = v4;
        }else{
            console.log("Please declare border by selecting either true, false, or the css border");
            return;
        }

        cnv.setAttribute('style', 'width: ' + (v1 * v3)  + '; '+ 'height: ' + (v2 * v3) + ';' + showBorder);
        canvases.push(cnv);
        if(typeof v5 !== 'undefined' && v5 === true ){
            document.body.appendChild(cnv);
        }
    }

    function removeCanvas(v1){ /* canvas to remove*/
        v1.parentNode.removeChild(v1);
    }



    return{
        canvas: canvases[0],
        canvases: canvases,
        createCanvas: createCanvas,
        removeCanvas: removeCanvas
    }

})();