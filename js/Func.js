// Реализация функционального подхода.

var JA;
if (!JA) JA = {};
JA.Func = {};

//==================================================================================================

// Дополнение функционала Array.
Array.Range = function(n)
{
    return Array.from(Array(n), (x, i) => i);
}
Array.prototype.Sum = function()
{
    return this.reduce((x, y) => x + y, 0);
}
Array.prototype.Max = function()
{
    return this.reduce((x, y) => Math.max(x, y), -Infinity);
}

//==================================================================================================

// Слияние двух массивов.
JA.Func.ZipWith = function(a, b, f)
{
    var res = [];

    for (var i = 0; i < a.length; i++)
    {
        res.push(f(a[i], b[i]));
    }

    return res;
}

//==================================================================================================
