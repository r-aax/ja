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

//==================================================================================================
