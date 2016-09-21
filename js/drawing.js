
/* Drawing code class */
function DrawingCanvas($canvas, size) {
	var canvas = $canvas.get(0);
		ctx = canvas.getContext("2d"),
		painting = false,
		lastX = 0,
		lastY = 0,
		lineThickness = 2,
		lineColor = "#000000",
		selected = "active",
		stamping = null;


	this.init = function(){
		canvas.width = canvas.height = size;
		$canvas.parent().css({
			width : (size + 2) + "px",
			height : (size + 2) + "px"
		});

		canvas.onmousedown = function(e) {
			if(stamping == null){
				painting = true;
				ctx.fillStyle = lineColor;
				lastX = e.pageX - $canvas.offset().left;
				lastY = e.pageY - $canvas.offset().top;
			}else{
				ctx.drawImage(stamping, e.pageX - $canvas.offset().left - 60, e.pageY - $canvas.offset().top - 60, 120, 120);
				stamping = null;
				$(".draw-stamps a").removeClass(selected);
			}
		};

		canvas.onmouseup = function(e){
			painting = false;
		}

		canvas.onmousemove = function(e) {
			if (painting) {
				mouseX = e.pageX - $canvas.offset().left;
				mouseY = e.pageY - $canvas.offset().top;

				// find all points between
				var x1 = mouseX,
					x2 = lastX,
					y1 = mouseY,
					y2 = lastY;

				var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
				if (steep){
					var x = x1;
					x1 = y1;
					y1 = x;

					var y = y2;
					y2 = x2;
					x2 = y;
				}
				if (x1 > x2) {
					var x = x1;
					x1 = x2;
					x2 = x;

					var y = y1;
					y1 = y2;
					y2 = y;
				}

				var dx = x2 - x1,
					dy = Math.abs(y2 - y1),
					error = 0,
					de = dy / dx,
					yStep = -1,
					y = y1;

				if (y1 < y2) {
					yStep = 1;
				}


				for (var x = x1; x < x2; x++) {
					ctx.beginPath();
					if (steep) {
						//ctx.fillRect(y, x, lineThickness , lineThickness );
						ctx.arc(y,x,lineThickness,0,2*Math.PI);
					} else {
						//ctx.fillRect(x, y, lineThickness , lineThickness );
						ctx.arc(x,y,lineThickness,0,2*Math.PI);
					}
					ctx.closePath();
					ctx.fill();

					error += de;
					if (error >= 0.5) {
						y += yStep;
						error -= 1.0;
					}
				}
				lastX = mouseX;
				lastY = mouseY;

			}
		}

		$(".draw-swatches a").click(function(e){
			e.preventDefault;
			$(".draw-swatches a, .draw-stamps a, .draw-erases a").removeClass(selected);
			$(this).addClass(selected);
			lineColor = $(this).attr("href");
			stamping = null;
			ctx.globalCompositeOperation = "source-over";
			return false;
		});

		$(".draw-brushes a").click(function(e){
			e.preventDefault;
			$(".draw-brushes a, .draw-stamps a, .draw-erases a").removeClass(selected);
			$(this).addClass(selected);
			lineThickness = $(this).attr("href").replace("#", "");
			stamping = null;
			ctx.globalCompositeOperation = "source-over";
			return false;
		});

		$(".draw-stamps a").click(function(e){
			e.preventDefault;
			$(".draw-stamps a, .draw-erases a").removeClass(selected);
			$(this).addClass(selected);
			stamping = $(this).find("img").get(0);
			ctx.globalCompositeOperation = "source-over";
			return false;
		});

		$(".draw-erases a").click(function(e){
			e.preventDefault;
			$(".draw-stamps a, .draw-erases a").removeClass(selected);
			$(this).addClass(selected);
			stamping = null;
			lineThickness = 8;

			ctx.globalCompositeOperation = "destination-out";
			return false;
		});

		$(".draw-clear").click(function(e){
			e.preventDefault;
			ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );
			return false;
		});

		$(".draw-save").click(function(e){
			e.preventDefault;
			var canvas = document.getElementById("draw-canvas");
			var img = canvas.toDataURL("image/png");
			document.write('<img src="'+img+'"/>');
		});

		$(".draw-print").click(function(e){
			e.preventDefault();
			var prtWin = window.open('', 'My Drawing', 'height=400,width=600');
			var canvas = document.getElementById("draw-canvas");
			var img = canvas.toDataURL("image/png");
			prtWin.document.write('<html><head><title>My Drawing</title>');
			prtWin.document.write('</head><body>');
			prtWin.document.write('<img src="' + img + '" width="100%" height="100%" />');
			prtWin.document.write('</body></html>');
			prtWin.print();
			//prtWin.close();
		});
	}
}


/* Drawing Code */
var $c = $("canvas")
if($c.size() > 0){
	if($c.hasClass("draw-canvas")){
		var cdraw = new DrawingCanvas($c, $c.parent().width());
		cdraw.init();
	}
}
