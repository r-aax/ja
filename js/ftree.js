// Реализация функционального дерева.

var JA;
if (!JA) JA = {};
JA.FTree = {};

//==================================================================================================

// Создание ребра дерева.
// Ребро знает о своем предшественнике и последователе.
JA.FTree.Edge = function(pred, succ)
{
    this.Pred = pred;
    this.Succ = succ;
}

//==================================================================================================

// Создание дерева.
// Задается тип, имя и описание.
// Потомков нет, родителя тоже нет.
JA.FTree.Tree = function(tp, nm, descr)
{
    this.Type = tp;
    this.Name = nm;
    this.Description = descr;
    this.ParentEdge = undefined;
    this.ChildrenEdges = [];
}

//--------------------------------------------------------------------------------------------------

// Доступ к родителю и детям.
JA.FTree.Tree.prototype.Parent = function()
{
    var edge = this.ParentEdge;

    if (edge == undefined)
    {
        return undefined;
    }
    else
    {
        return edge.Pred;
    }
}
JA.FTree.Tree.prototype.ChildrenCount = function()
{
    return this.ChildrenEdges.length;
}
JA.FTree.Tree.prototype.ChildEdge = function(i)
{
    return this.ChildrenEdges[i];
}
JA.FTree.Tree.prototype.Children = function()
{
    return this.ChildrenEdges.map(function(e) { return e.Succ; });
}
JA.FTree.Tree.prototype.Child = function(i)
{
    return this.Children()[i];
}

//--------------------------------------------------------------------------------------------------

// Получение индекса.
JA.FTree.Tree.prototype.Index = function()
{
    if (this.IsRoot())
    {
        return -1;
    }
    else
    {
        return this.Parent().ChildrenEdges.indexOf(this.ParentEdge);
    }
}
JA.FTree.Tree.prototype.IsFirstChild = function()
{
    return this.Index() == 0;
}
JA.FTree.Tree.prototype.IsLastChild = function()
{
    if (this.IsRoot())
    {
        return false;
    }
    else
    {
        return Index() == (this.Parent().ChildrenCount() - 1);
    }
}

//--------------------------------------------------------------------------------------------------

// Простые ппроверки дерева на корень и лист.
JA.FTree.Tree.prototype.IsRoot = function()
{
    return this.Parent() == undefined;
}
JA.FTree.Tree.prototype.IsLeaf = function()
{
    return this.ChildrenCount() == 0;
}

//--------------------------------------------------------------------------------------------------

// Добавление потомка.
JA.FTree.Tree.prototype.AddChild = function(child)
{
    var edge = new JA.FTree.Edge(this, child);

    this.ChildrenEdges.push(edge);
    child.ParentEdge = edge;
}

//--------------------------------------------------------------------------------------------------

// Получение уровня дерева внутри охватывающего дерева.
JA.FTree.Tree.prototype.Level = function()
{
    if (this.IsRoot())
    {
        return 0;
    }
    else
    {
        return 1 + this.Parent().Level();
    }
}

//--------------------------------------------------------------------------------------------------

// Поиск узла дерева.
JA.FTree.Tree.prototype.Find = function(fun)
{
    // Проверяем сам узел.
    if (fun(this))
    {
        return this;
    }

    // Проверяем детей.
    for (var i = 0; i < this.ChildrenCount(); i++)
    {
        var child = this.Child(i);
        var res = child.Find(fun);

        if (res != undefined)
        {
            return res;
        }
    }

    // Узел не найден.
    return undefined;
}

//--------------------------------------------------------------------------------------------------

// Получение всех листов в виде плоского списка.
JA.FTree.Tree.prototype.GetFlatLeafs = function()
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

        return this.Children()
               .map(function(ch) { return ch.GetFlatLeafs(); })
               .reduce(function(acc, list) { return acc.concat(list); });
    }
}

//--------------------------------------------------------------------------------------------------

// Получение всех узлов в виде плоского списка.
JA.FTree.Tree.prototype.GetFlatNodes = function()
{
    var flat = [this];

    if (!this.IsLeaf())
    {
        // Добавляем к нему списки детей.
        flat = flat.concat(this.Children()
                           .map(function(ch) { return ch.GetFlatNodes(); })
                           .reduce(function(acc, list) { return acc.concat(list); }));
    }

    return flat;
}

//--------------------------------------------------------------------------------------------------

// Обход всех узлов дерева в применением действия.
JA.FTree.Tree.prototype.ForEach = function(fun)
{
    fun(this);

    for (var i = 0; i < this.ChildrenCount(); i++)
    {
        this.Child(i).ForEach(fun);
    }
}

//--------------------------------------------------------------------------------------------------

// Свертка дерева.
JA.FTree.Tree.prototype.Fold = function(before, node_fun,
                                        before_children_fun, after_children_fun, after)
{
    var res = before;

    res = node_fun(res, this);

    if (this.ChildrenCount() > 0)
    {
        res = before_children_fun(res, this);

        for (var i = 0; i < this.ChildrenCount(); i++)
        {
            res = this.Child(i).Fold(res, node_fun, before_children_fun, after_children_fun, "");
        }

        res = after_children_fun(res, this);
    }

    return res + after;
}

//==================================================================================================
