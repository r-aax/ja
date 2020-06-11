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
    this.ParentEdge = undefined;
    this.ChildrenEdges = [];
}

//--------------------------------------------------------------------------------------------------

// Доступ к родителю и детям.
Tree.prototype.Parent = function()
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
Tree.prototype.ChildrenCount = function()
{
    return this.ChildrenEdges.length;
}
Tree.prototype.ChildEdge = function(i)
{
    return this.ChildrenEdges[i];
}
Tree.prototype.Children = function()
{
    return this.ChildrenEdges.map(function(e) { return e.Succ; });
}
Tree.prototype.Child = function(i)
{
    return this.Children()[i];
}

//--------------------------------------------------------------------------------------------------

// Простые ппроверки дерева на корень и лист.
Tree.prototype.IsRoot = function()
{
    return this.Parent() == undefined;
}
Tree.prototype.IsLeaf = function()
{
    return this.ChildrenCount() == 0;
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

// Получение уровня дерева внутри охватывающего дерева.
Tree.prototype.Level = function()
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

        return this.Children()
               .map(function(ch) { return ch.GetFlatLeafs(); })
               .reduce(function(acc, list) { return acc.concat(list); });
    }
}

//--------------------------------------------------------------------------------------------------

// Получение всех узлов в виде плоского списка.
Tree.prototype.GetFlatNodes = function()
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

//==================================================================================================
