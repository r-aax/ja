// Реализация функционального дерева.

//==================================================================================================

// Создание ребра дерева.
// Ребро знает о своем предшественнике и последователе.
function Edge(pred, succ)
{
    this.Pred = pred;
    this.Succ = succ;
}

//==================================================================================================

// Создание дерева.
// Задается тип, имя и описание.
// Потомков нет, родителя тоже нет.
function Tree(tp, nm, descr)
{
    this.Type = tp;
    this.Name = nm;
    this.Description = descr;
    this.ChildrenEdges = [];
    this.ParentEdge = null;
}

//--------------------------------------------------------------------------------------------------

// Простые ппроверки дерева на корень и лист.
Tree.prototype.IsRoot = function()
{
    return this.ParentEdge == null;
}
Tree.prototype.IsLeaf = function()
{
    return this.ChildrenEdges.length == 0;
}

//--------------------------------------------------------------------------------------------------

// Добавление потомка.
Tree.prototype.AddChild = function(child)
{
    var edge = new Edge(this, child);

    this.ChildrenEdges.push(edge);
    child.ParentEdge = edge;
}

//--------------------------------------------------------------------------------------------------

// Проход по детям.
Tree.prototype.ChildrenCount = function()
{
    return this.ChildrenEdges.length;
}
Tree.prototype.Child = function(i)
{
    return this.ChildrenEdges[i].Succ;
}

//--------------------------------------------------------------------------------------------------

// Получение уровня дерева внутри охватывающего дерева.
Tree.prototype.Level = function()
{
    if (this.ParentEdge == null)
    {
        return 0;
    }
    else
    {
        return 1 + this.ParentEdge.Pred.Level();
    }
}

//--------------------------------------------------------------------------------------------------

// Поиск узла дерева.
Tree.prototype.Find = function(fun)
{
    // Проверяем сам узел.
    if (fun(this))
    {
        return this;
    }

    // Проверяем детей.
    for (var i = 0; i < this.ChildrenCount(); i++)
    {
        var child = this.ChildrenEdges[i].Succ;
        var res = child.Find(fun);

        if (res != null)
        {
            return res;
        }
    }

    // Все.
    return null;
}

//--------------------------------------------------------------------------------------------------

// Получение всех листов в виде плоского списка.
Tree.prototype.GetFlatLeafs = function()
{
    // Проверяем сам узел.
    if (this.IsLeaf())
    {
        return [this];
    }
    else
    {
        // Так как узел не является листом,
        // то надо применить функцию ко всем детям,
        // а потом соединить все результаты.

        var map_tmp = this.ChildrenEdges.map(function(e) { return e.Succ.GetFlatLeafs(); });
        var reduce_tmp = map_tmp.reduce(function(acc, elem) { return acc.concat(elem); });

        return reduce_tmp;
    }
}

//==================================================================================================
//==================================================================================================
