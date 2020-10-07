// Реализация структуры xBOM и организации производственной цепочки.

//==================================================================================================

// Единица учета.
Item = function(name, description, quantity)
{
    this.Name = name;
    this.Description = description;
    this.Quantity = quantity;
}
Item.prototype.Clone = function()
{
    return new Item(this.Name, this.Description, this.Quantity);
}
Item.prototype.Q = function(quantity)
{
    var c = new Item(this.Name, this.Description, quantity);

    return c;
}
Item.prototype.IsPrimary = function()
{
    return this.Name[0] == 'P';
}
Item.prototype.IsSecondary = function()
{
    return this.Name[0] == 'S';
}

//==================================================================================================

// Хранилище учета.
Stock = function()
{
    this.Items = [];
}
Stock.prototype.Find = function(item)
{
    var items = this.Items.filter(x => x.Name == item.Name);

    return items[0];
}
Stock.prototype.HTML = function()
{
    return "<table border=\"1\"><tr><th>name</th><th>description</th><th>quantity</th></tr>"
           + this.Items.map(i => "<tr><td>" + i.Name
                                 + "</td><td>" + i.Description
                                 + "</td><td>" + i.Quantity
                                 + "</td></tr>").MergeStrings()
           + "</table>";
}

//==================================================================================================

// Операция.
Operation = function(name, description, source_items, duration, result)
{
    this.Name = name;
    this.Description = description;
    this.SourceItems = source_items;
    this.Duration = duration;
    this.Result = result;
}
Operation.prototype.SourceItemsString = function()
{
    return this.SourceItems.map(x => x.Name + " x " + x.Quantity + ", ").MergeStrings().slice(0, -2);
}

//==================================================================================================

// Технология.
Technology = function()
{
    this.Operations = [];
}
Technology.prototype.Find = function(operation)
{
    var operations = this.Operations.filter(x => x.Name == operation.Name);

    return operations[0];
}
Technology.prototype.FindForResult = function(result)
{
    var operations = this.Operations.filter(x => x.Result.Name == result.Name);

    return operations[0];
}
Technology.prototype.HTML = function()
{
    return "<table border=\"1\"><tr><th>name</th><th>description</th><th>sources</th><th>duration</th><th>result</th></tr>"
           + this.Operations.map(o => "<tr><td>" + o.Name
                                      + "</td><td>" + o.Description
                                      + "</td><td>" + o.SourceItemsString()
                                      + "</td><td>" + o.Duration
                                      + "</td><td>" + o.Result.Name).MergeStrings()
           + "</table>";
}

//==================================================================================================

// BOM.
BOM = function(item, stock, technology)
{
    this.Item = item;
    this.Operation = undefined;
    this.Stock = stock;
    this.Technology = technology;
    this.Children = [];
}
BOM.prototype.Expand = function()
{
    if (this.Item.IsPrimary())
    {
        ;
    }
    else if (this.Item.IsSecondary())
    {
        // Find operation.
        var operation = this.Technology.FindForResult(this.Item);
        this.Operation = operation;

        // Fill children.
        for (var i = 0; i < operation.SourceItems.length; i++)
        {
            var bom = new BOM(operation.SourceItems[i].Clone(),
                              this.Stock,
                              this.Technology);

            this.Children.push(bom);

            // Expand this new bom.
            bom.Expand();
        }
    }
    else
    {
        alert("Uknown type of item");
    }
}
BOM.prototype.HTML = function(val = 1)
{
    var res = "<ul>";

    res = res + "<li>";

    var val_str = (val == 1) ? "" : ("x" + val + " ");
    res = res
          + val_str + "<b>" + this.Item.Name + "</b> "
          + "(<i>" + this.Item.Description + "</i>)"
          + ((this.Operation == undefined) ? "" : (" &larr; <b>"
                                                   + this.Operation.Name
                                                   + "</b> "
                                                   + "(<i>" + this.Operation.Description 
                                                   + " / t=" + this.Operation.Duration + "</i>)"));

    for (var i = 0; i < this.Children.length; i++)
    {
        res = res + this.Children[i].HTML(this.Children[i].Item.Quantity);
    }

    res = res + "</li>";

    res = res + "</ul>";

    return res;
}

//--------------------------------------------------------------------------------------------------

// Симуляция производства.
BOM.prototype.SimulateProduction = function()
{
    this.RecProduce();
}
BOM.prototype.ProduceSecondaryItem = function()
{
    if (this.Item.IsSecondary())
    {
        var operation = this.Operation;

        for (var i = 0; i < this.Children.length; i++)
        {
            var item_in_stock = this.Stock.Find(this.Children[i].Item);
            var item_in_operation = operation.SourceItems[i];
            
            item_in_stock.Quantity -= item_in_operation.Quantity;
        }

        var result_in_stock = this.Stock.Find(this.Item);

        result_in_stock.Quantity += 1;
    }
}
BOM.prototype.RecProduce = function()
{
    if (this.Item.IsSecondary())
    {
        var operation = this.Operation;

        for (var i = 0; i < this.Children.length; i++)
        {
            while (this.Stock.Find(this.Children[i].Item).Quantity < operation.SourceItems[i].Quantity)
            {
                this.Children[i].RecProduce();
            }
        }

        this.ProduceSecondaryItem();
    }
}

//==================================================================================================
