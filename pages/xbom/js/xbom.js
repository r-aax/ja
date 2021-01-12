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

    if (operations.length > 0)
    {
        return operations[0];
    }
    else
    {
        return undefined;
    }
}
Technology.prototype.FindForResult = function(result)
{
    var operations = this.Operations.filter(x => x.Result.Name == result.Name);

    if (operations.length > 0)
    {
        return operations[0];
    }
    else
    {
        return undefined;
    }
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

SupplyTableLine = function(item, time, quantity)
{
    this.Item = item;
    this.Time = time;
    this.Quantity = quantity;
}
SupplyTable = function()
{
    this.A = [];
}
SupplyTable.prototype.Add = function(item, time, quantity)
{
    this.A.push(new SupplyTableLine(item, time, quantity));
}
SupplyTable.prototype.Get = function(time)
{
    return this.A.filter(line => line.Time == time);
}
SupplyTable.prototype.Remove = function(time)
{
    this.A = this.A.filter(line => line.Time != time);
}
SupplyTable.prototype.TotalQuantity = function(item)
{
    return this.A.filter(line => line.Item.Name == item.Name).map(line => line.Quantity).Sum();
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
    //if (this.Item.IsPrimary())
    //{
    //    ;
    //}
    //else if (this.Item.IsSecondary())
    //{
        // Find operation.
        var operation = this.Technology.FindForResult(this.Item);

        if (operation == undefined)
        {
            return;
        }

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
    //}
    //else
    //{
    //    alert("Uknown type of item");
    //}
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
    var max_steps = 30;
    var current_time = 0;
    var supply_table = new SupplyTable();

    // Надо симулировать производство пока не произведено изделие.
    while (this.Stock.Find(this.Item).Quantity < 1)
    {
        if (this.Stock.Find(this.Item).Quantity + supply_table.TotalQuantity(this.Item) < 1)
        {
            this.RecProduce(current_time, supply_table);
        }

        max_steps--;

        if (max_steps == 0)
        {
            break;
        }

        current_time++;
        // Корректировка supply_table.
        var on_time = supply_table.Get(current_time);
        for (var i = 0; i < on_time.length; i++)
        {
            //alert(on_time[i].Quantity);
            this.Stock.Find(on_time[i].Item).Quantity += on_time[i].Quantity;

            alert("Finish to produce : " + on_time[i].Item.Name + " (" + on_time[i].Item.Description + ") t = " + current_time);
        }
        supply_table.Remove(current_time);
    }
}
BOM.prototype.ProduceSecondaryItem = function(current_time, supply_table)
{
    alert("Begin to produce : " + this.Item.Name + " (" + this.Item.Description + ") t = " + current_time);

    if (this.Item.IsSecondary())
    {
        var operation = this.Operation;

        for (var i = 0; i < this.Children.length; i++)
        {
            var item_in_stock = this.Stock.Find(this.Children[i].Item);
            var item_in_operation = operation.SourceItems[i];
            
            item_in_stock.Quantity -= item_in_operation.Quantity;
        }

        supply_table.Add(this.Item, current_time + operation.Duration, 1);
    }
}
BOM.prototype.RecProduce = function(current_time, supply_table)
{
    if (this.Item.IsSecondary())
    {
        var operation = this.Operation;

        for (var i = 0; i < this.Children.length; i++)
        {
            if (this.Stock.Find(this.Children[i].Item).Quantity + supply_table.TotalQuantity(this.Children[i].Item) < operation.SourceItems[i].Quantity)
            {
                this.Children[i].RecProduce(current_time, supply_table);

                //return;
            }
        }

        for (var i = 0; i < this.Children.length; i++)
        {
            if (this.Stock.Find(this.Children[i].Item).Quantity < operation.SourceItems[i].Quantity)
            {
                return;
            }
        }

        this.ProduceSecondaryItem(current_time, supply_table);
    }
}

//==================================================================================================
