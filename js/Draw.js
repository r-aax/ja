// Draw functions.

var JA;
if (!JA) JA = {};
JA.Draw = {};

//==================================================================================================
// Drawer class.
//==================================================================================================

//--------------------------------------------------------------------------------------------------
// Create.
//--------------------------------------------------------------------------------------------------

// Constructor.
//
// Arguments:
//   id - canvas identifier,
//   r_width - width of real scope,
//   r_height - height of real scope,
//   is_x_inv - is x coordinate inverted,
//   is_y_inv - is y coordinate inverted,
//   margin_left - left margin,
//   margin_right - right margin,
//   margin_up - up margin,
//   margin_down - down margin.
JA.Draw.Drawer = function(id, r_width, r_height, is_x_inv, is_y_inv,
                          margin_left = 0, margin_right = 0,
                          margin_up = 0, margin_down = 0)
{
    this.Canvas = document.getElementById(id);
    this.Context = this.Canvas.getContext("2d");

    var w = this.Canvas.width - margin_left - margin_right;
    var h = this.Canvas.height - margin_up - margin_down;

    var affin = function(x, from, to, is_inv)
    {
        if (!is_inv)
        {
            return x * (to / from);
        }
        else
        {
            return to - x * (to / from);
        }
    };

    // Functions for transfer point from real point
    // to draw area and vice versa.
    this.TX = function(x)
    {
        return margin_left + affin(x, r_width, w, is_x_inv);
    };
    this.TY = function(y)
    {
        return margin_up + affin(y, r_height, h, is_y_inv);
    };
    this.FX = function(x)
    {
        return affin(x - margin_left, w, r_width, is_x_inv);
    };
    this.FY = function(y)
    {
        return affin(y - margin_up, h, r_height, is_y_inv);
    }
}

//--------------------------------------------------------------------------------------------------
// General functions.
//--------------------------------------------------------------------------------------------------

// Get random color.
//
// Result:
//   Random color.
JA.Draw.Drawer.RandomColor = function()
{
    var str = "#"
              + Math.floor(28 + 200 * Math.random()).toString(16)
              + Math.floor(28 + 200 * Math.random()).toString(16)
              + Math.floor(28 + 200 * Math.random()).toString(16);

    return str;
}

//--------------------------------------------------------------------------------------------------
// Style.
//--------------------------------------------------------------------------------------------------

// Set color.
//
// Arguments:
//   s - color.
JA.Draw.Drawer.prototype.SetColor = function(s)
{
    this.Context.strokeStyle = s;
}

//--------------------------------------------------------------------------------------------------

// Set fill color.
//
// Arguments:
//   s - fill color.
JA.Draw.Drawer.prototype.SetFillColor = function(s)
{
    this.Context.fillStyle = s;
}

//--------------------------------------------------------------------------------------------------

// Set line width.
//
// Arguments:
//   w - line width.
JA.Draw.Drawer.prototype.SetLineWidth = function(w)
{
    this.Context.lineWidth = w;
}

//--------------------------------------------------------------------------------------------------

// Set font.
//
// Arguments:
//   font - font description.
JA.Draw.Drawer.prototype.SetFont = function(font)
{
    this.Context.font = font;
}

//--------------------------------------------------------------------------------------------------
// Line.
//--------------------------------------------------------------------------------------------------

// Draw line in canvas coordiates.
//
// Arguments:
//   x1 - x coordinate of the first point,
//   y1 - y coordinate of the first point,
//   x2 - x coordinate of the second point,
//   y2 - y coordinate of the second point.
JA.Draw.Drawer.prototype.DrawLineI = function(x1, y1, x2, y2)
{
    with (this.Context)
    {
        beginPath();
        moveTo(x1, y1);
        lineTo(x2, y2);
        stroke();
        closePath();
    }
}

//--------------------------------------------------------------------------------------------------

// Draw line.
//
// Arguments:
//   x1 - x coordinate of the first point,
//   y1 - y coordinate of the first point,
//   x2 - x coordinate of the second point,
//   y2 - y coordinate of the second point.
JA.Draw.Drawer.prototype.DrawLine = function(x1, y1, x2, y2)
{
    var tx1 = this.TX(x1);
    var ty1 = this.TY(y1);
    var tx2 = this.TX(x2);
    var ty2 = this.TY(y2);

    this.DrawLineI(tx1, ty1, tx2, ty2);
}

//--------------------------------------------------------------------------------------------------
// Rectangle.
//--------------------------------------------------------------------------------------------------

// Draw rectangle in canvas coordinates.
//
// Arguments:
//   x1 - x coordinate of the first point,
//   y1 - y coordinate of the first point,
//   x2 - x coordinate of the second point,
//   y2 - y coordinate of the second point.
JA.Draw.Drawer.prototype.DrawRectI = function(x1, y1, x2, y2)
{
    this.Context.strokeRect(x1, y1, x2 - x1, y2 - y1);
}

//--------------------------------------------------------------------------------------------------

// Draw rectangle.
//
// Arguments:
//   x1 - x coordinate of the first point,
//   y1 - y coordinate of the first point,
//   x2 - x coordinate of the second point,
//   y2 - y coordinate of the second point.
JA.Draw.Drawer.prototype.DrawRect = function(x1, y1, x2, y2)
{
    var tx1 = this.TX(x1);
    var ty1 = this.TY(y1);
    var tx2 = this.TX(x2);
    var ty2 = this.TY(y2);

    this.DrawRectI(tx1, ty1, tx2, ty2);
}

//--------------------------------------------------------------------------------------------------

// Draw centered rectangle in canvas coordinates.
//
// Arguments:
//   x - x coordinate of center,
//   y - y coordinate of center,
//   w - width,
//   h - height.
JA.Draw.Drawer.prototype.DrawRectCenteredI = function(x, y, w, h)
{
    this.DrawRectI(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
}

//--------------------------------------------------------------------------------------------------

// Draw centered rectangle.
//
// Arguments:
//   x - x coordinate of center,
//   y - y coordinate of center,
//   w - width,
//   h - height.
JA.Draw.Drawer.prototype.DrawRectCentered = function(x, y, w, h)
{
    this.DrawRect(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
}

//--------------------------------------------------------------------------------------------------

// Fill rectangle in canvas coordinates.
//
// Arguments:
//   x1 - x coordinate of the first point,
//   y1 - y coordinate of the first point,
//   x2 - x coordinate of the second point,
//   y2 - y coordinate of the second point.
JA.Draw.Drawer.prototype.FillRectI = function(x1, y1, x2, y2)
{
    this.Context.fillRect(x1, y1, x2 - x1, y2 - y1);
}

//--------------------------------------------------------------------------------------------------

// Fill rectangle.
//
// Arguments:
//   x1 - x coordinate of the first point,
//   y1 - y coordinate of the first point,
//   x2 - x coordinate of the second point,
//   y2 - y coordinate of the second point.
JA.Draw.Drawer.prototype.FillRect = function(x1, y1, x2, y2)
{
    var tx1 = this.TX(x1);
    var ty1 = this.TY(y1);
    var tx2 = this.TX(x2);
    var ty2 = this.TY(y2);

    this.FillRectI(tx1, ty1, tx2, ty2);
}

//--------------------------------------------------------------------------------------------------

// Fill centered rectangle in canvas coordinates.
//
// Arguments:
//   x - x coordinate of center,
//   y - y coordinate of center,
//   w - width,
//   h - height.
JA.Draw.Drawer.prototype.FillRectCenteredI = function(x, y, w, h)
{
    this.FillRectI(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
}

//--------------------------------------------------------------------------------------------------

// Fill centered rectangle.
//
// Arguments:
//   x - x coordinate of center,
//   y - y coordinate of center,
//   w - width,
//   h - height.
JA.Draw.Drawer.prototype.FillRectCentered = function(x, y, w, h)
{
    this.FillRect(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
}

//--------------------------------------------------------------------------------------------------

// Clear rectangle in canvas coordinates.
//
// Arguments:
//   x1 - x coordinate of the first point,
//   y1 - y coordinate of the first point,
//   x2 - x coordinate of the second point,
//   y2 - y coordinate of the second point.
JA.Draw.Drawer.prototype.ClearRectI = function(x1, y1, x2, y2)
{
    this.Context.clearRect(x1, y1, x2 - x1, y2 - y1);
}

//--------------------------------------------------------------------------------------------------

// Clear rectangle.
//
// Arguments:
//   x1 - x coordinate of the first point,
//   y1 - y coordinate of the first point,
//   x2 - x coordinate of the second point,
//   y2 - y coordinate of the second point.
JA.Draw.Drawer.prototype.ClearRect = function(x1, y1, x2, y2)
{
    var tx1 = this.TX(x1);
    var ty1 = this.TY(y1);
    var tx2 = this.TX(x2);
    var ty2 = this.TY(y2);

    this.ClearRectI(tx1, ty1, tx2, ty2);
}

//--------------------------------------------------------------------------------------------------

// Fill whole area of drawing.
JA.Draw.Drawer.prototype.Fill = function()
{
    this.FillRectI(0, 0, this.Canvas.width, this.Canvas.height);
}

//--------------------------------------------------------------------------------------------------

// Clear whole area of drawing.
JA.Draw.Drawer.prototype.Clear = function()
{
    this.ClearRectI(0, 0, this.Canvas.width, this.Canvas.height);
}

//--------------------------------------------------------------------------------------------------
// Circle.
//--------------------------------------------------------------------------------------------------

// Draw circle in canvas coordinates.
//
// Arguments:
//   x - x coorfinate,
//   y - y coordinate,
//   r - radius.
JA.Draw.Drawer.prototype.DrawCircleI = function(x, y, r)
{
    with (this.Context)
    {
        beginPath();
        arc(x, y, r, 0, 2 * Math.PI);
        stroke();
        closePath();
    }
}

//--------------------------------------------------------------------------------------------------

// Draw point in canvas coordinates (equal to DrawCircleI).
//
// Arguments:
//   x - x coorfinate,
//   y - y coordinate,
//   r - radius.
JA.Draw.Drawer.prototype.DrawPointI = function(x, y, r)
{
    this.DrawCircleI(x, y, r);
}

//--------------------------------------------------------------------------------------------------

// Draw sector.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   r - radius,
//   fa - from angle,
//   ta - to angle.
JA.Draw.Drawer.prototype.DrawSector = function(x, y, r, fa, ta)
{
    if (r > 0)
    {
        var tx = this.TX(x);
        var ty = this.TY(y);
        var tx1 = this.TX(x + r);
        var ty1 = this.TY(y + r);
        var dy = Math.abs(ty1 - ty);

        with (this.Context)
        {
            save();
            beginPath();
            translate(tx, ty);
            scale(Math.abs((tx1 - tx) / dy), 1);
            arc(0, 0, dy, fa, ta);
            stroke();
            restore();
            closePath();
        }
    }
}

//--------------------------------------------------------------------------------------------------

// Draw circle.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   r - radius.
JA.Draw.Drawer.prototype.DrawCircle = function(x, y, r)
{
    this.DrawSector(x, y, r, 0.0, 2.0 * Math.PI);
}

//--------------------------------------------------------------------------------------------------

// Draw point.
// Radius is constant.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   r - radius.
JA.Draw.Drawer.prototype.DrawPoint = function(x, y, r)
{
    var tx = this.TX(x);
    var ty = this.TY(y);

    this.DrawPointI(tx, ty, r);
}

//--------------------------------------------------------------------------------------------------

// Fill circle in canvas coordinates.
//
// Arguments:
//   x - x coorfinate,
//   y - y coordinate,
//   r - radius.
JA.Draw.Drawer.prototype.FillCircleI = function(x, y, r)
{
    with (this.Context)
    {
        beginPath();
        arc(x, y, r, 0, 2 * Math.PI);
        fill();
        closePath();
    }
}

//--------------------------------------------------------------------------------------------------

// Fill point in canvas coordinates (equal to FillCircleI).
//
// Arguments:
//   x - x coorfinate,
//   y - y coordinate,
//   r - radius.
JA.Draw.Drawer.prototype.FillPointI = function(x, y, r)
{
    this.FillCircleI(x, y, r);
}

//--------------------------------------------------------------------------------------------------

// Fill sector.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   r - radius,
//   fa - from angle,
//   ta - to angle.
JA.Draw.Drawer.prototype.FillSector = function(x, y, r, fa, ta)
{
    if (r > 0)
    {
        var tx = this.TX(x);
        var ty = this.TY(y);
        var tx1 = this.TX(x + r);
        var ty1 = this.TY(y + r);
        var dy = Math.abs(ty1 - ty);

        with (this.Context)
        {
            save();
            beginPath();
            translate(tx, ty);
            scale(Math.abs((tx1 - tx) / dy), 1);
            arc(0, 0, dy, fa, ta);
            lineTo(0, 0);
            fill();
            restore();
            closePath();
        }
    }
}

//--------------------------------------------------------------------------------------------------

// Fill circle.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   r - radius.
JA.Draw.Drawer.prototype.FillCircle = function(x, y, r)
{
    this.FillSector(x, y, r, 0.0, 2.0 * Math.PI);
}

//--------------------------------------------------------------------------------------------------

// Fill point.
// Radius is constant.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   r - radius.
JA.Draw.Drawer.prototype.FillPoint = function(x, y, r)
{
    var tx = this.TX(x);
    var ty = this.TY(y);

    this.FillPointI(tx, ty, r);
}

//--------------------------------------------------------------------------------------------------
// Text.
//--------------------------------------------------------------------------------------------------

// Draw text in canvas coordinates.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   text - text to draw.
JA.Draw.Drawer.prototype.DrawTextI = function(x, y, text)
{
    this.Context.fillText(text, x, y);
}

//--------------------------------------------------------------------------------------------------

// Draw text.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   text - text to draw.
JA.Draw.Drawer.prototype.DrawText = function(x, y, text)
{
    var tx = this.TX(x);
    var ty = this.TY(y);

    this.DrawTextI(tx, ty, text);
}

//--------------------------------------------------------------------------------------------------

// Draw centered text in canvas coordinates.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   text - text to draw.
JA.Draw.Drawer.prototype.DrawTextCenteredI = function(x, y, text)
{
    var align = this.Context.textAlign;

    this.Context.textAlign = "center";
    this.DrawTextI(x, y, text);
    this.Context.textAlign = align;
}

//--------------------------------------------------------------------------------------------------

// Draw centered text.
//
// Arguments:
//   x - x coordinate,
//   y - y coordinate,
//   text - text to draw.
JA.Draw.Drawer.prototype.DrawTextCentered = function(x, y, text)
{
    var align = this.Context.textAlign;

    this.Context.textAlign = "center";
    this.DrawText(x, y, text);
    this.Context.textAlign = align;
}

//==================================================================================================

// Draw horizontal histogram.
//
// Arguments:
//   dict - dictionary,
//   min_value - for filter,
//   element_height - height of the element,
//   text_left_offset - text offset into negative zone,
//   eps - epsilon between rows,
//   tr1_color - color of first 1/3,
//   tr2_color - color of second 1/3,
//   tr3_color - color of third 1/3.
JA.Draw.Drawer.prototype.DrawHorizontalHistogram = function(dict, min_value,
                                                            element_height,
                                                            text_left_offset,
                                                            eps,
                                                            tr1_color,
                                                            tr2_color,
                                                            tr3_color)
{
    var arr = Object.entries(dict).filter(x => x[1] >= min_value);
    var max_value = arr.map(x => x[1]).Max();
    var values_diapason_3 = (max_value - min_value) / 3;
    var tr1_value = max_value - values_diapason_3;
    var tr2_value = tr1_value - values_diapason_3;

    for (var i = 0; i < arr.length; i++)
    {
        var v = arr[i][1];

        if (v >= tr1_value)
        {
            this.SetFillColor(tr1_color);
        }
        else if (v > tr2_value)
        {
            this.SetFillColor(tr2_color);
        }
        else
        {
            this.SetFillColor(tr3_color);
        }

        this.DrawText(text_left_offset, element_height * i - eps, arr[i][0]);
        this.FillRect(0.0, element_height * (i - 1) + eps,
                      100.0 * v / max_value, element_height * i - eps);
        this.DrawText(100.0 * v / max_value + 0.5, element_height * i - eps, v);
    }
}

//--------------------------------------------------------------------------------------------------

// Draw circle diagram.
//
// Arguments:
//   dict - dictionary with data,
//   cx - x coordinate of a center,
//   cy - y coordinate of a center,
//   r - radius,
//   is_labels - draw labels or not,
//   predefined_colors - fix colors.
JA.Draw.Drawer.prototype.DrawCircleDiagram = function(dict, min_value,
                                                      cx, cy, r,
                                                      is_labels = false,
                                                      predefined_colors = [])
{
    var arr = Object.entries(dict).filter(x => x[1] >= min_value);
    var values_sum = arr.map(x => x[1]).Sum();

    // Normalize.
    arr2 = arr.map(x => [x[0], x[1] / values_sum]);

    // Draw sectors.
    //var colors = ["red", "green"];
    var fa = 0.0;
    var ta = 0.0;
    for (var i = 0; i < arr2.length; i++)
    {
        ta = fa + 2.0 * Math.PI * arr2[i][1];

        if (predefined_colors.length > 0)
        {
            this.SetFillColor(predefined_colors[i]);
        }
        else
        {
            this.SetFillColor(JA.Draw.Drawer.RandomColor());
        }

        this.FillSector(cx, cy, r, fa, ta);

        fa = ta;
    }

    fa = 0.0;
    ta = 0.0;
    for (var i = 0; i < arr2.length; i++)
    {
        ta = fa + 2.0 * Math.PI * arr2[i][1];

        if (is_labels)
        {
            this.SetFillColor("black");
            var mid_angle = 0.5 * (fa + ta);
            var x = cx + r * Math.cos(mid_angle);
            var y = cy + r * Math.sin(mid_angle);
            this.FillPoint(x, y, 2.0);
            this.DrawText(x + 1.0, y + 1.0, arr2[i][0] + " / " + arr[i][1]);
        }

        fa = ta;
    }
}

//==================================================================================================
