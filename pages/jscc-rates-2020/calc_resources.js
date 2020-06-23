// Вычислительные ресурсы.

//==================================================================================================

// Заносим конфигурацию всех узлов:
//   100k - МВС-100К
//     tr - Tornado
//     ps - Petastream
//     hw - Haswell
//     bw - Broadwell
//    knl - Knights Landing
//     sl - Skylake
//     cl - Cascade Lake

//==================================================================================================

// Конфигурация вычислительного узла.
CalcNodeConfiguration = function(is_active, name, descr, usefull, energy)
{
    this.IsActive = is_active;
    this.Name = name;
    this.Description = descr;
    this.Usefull = usefull;
    this.Energy = energy;
}

//--------------------------------------------------------------------------------------------------

// Таблица конфигурации вычислительных узлов.
CalcNodesConfigurationTable = function()
{
    /*
     * [tr]:
     * https://ark.intel.com/content/www/ru/ru/ark/products/64596/intel-xeon-processor-e5-2690-20m-cache-2-90-ghz-8-00-gt-s-intel-qpi.html
     * https://technical.city/ru/cpu/Xeon-Phi-7110X#characteristics
     *
     * [hw]:
     * https://ark.intel.com/content/www/us/en/ark/products/81059/intel-xeon-processor-e5-2697-v3-35m-cache-2-60-ghz.html
     *
     * [bw]:
     * https://ark.intel.com/content/www/us/en/ark/products/91768/intel-xeon-processor-e5-2697a-v4-40m-cache-2-60-ghz.html
     *
     * [knl]:
     * https://ark.intel.com/content/www/ru/ru/ark/products/95830/intel-xeon-phi-processor-7290-16gb-1-50-ghz-72-core.html
     *
     * [sl]:
     * https://ark.intel.com/content/www/us/en/ark/products/120495/intel-xeon-gold-6154-processor-24-75m-cache-3-00-ghz.html
     *
     * [cl]:
     * https://ark.intel.com/content/www/ru/ru/ark/products/192481/intel-xeon-platinum-8268-processor-35-75m-cache-2-90-ghz.html
     */

    var table =
    [
        /*
        new CalcNodeConfiguration(0, "100k", "MVS-100K",        1.00, ( 36.0 / 110) * 2.00),
        */

        new CalcNodeConfiguration(1,   "tr", "Tornado",         0.50, ((2 * (0.135 + 0.3)) / 0.7) * 1.25),

        /*
        new CalcNodeConfiguration(0,   "ps", "Petastream",      1.00, ( 15.0 /   8) * 1.25),
        */

        new CalcNodeConfiguration(1,   "hw", "Haswell",         1.00, ((2 * 0.145) / 0.7) * 1.06),
        new CalcNodeConfiguration(1,   "bw", "Broadwell",       1.00, ((2 * 0.145) / 0.7) * 1.06),
        new CalcNodeConfiguration(1,  "knl", "Knights Landing", 1.00, ((0.245)     / 0.7) * 1.06),
        new CalcNodeConfiguration(1,   "sl", "Skylake",         1.00, ((2 * 0.200) / 0.7) * 1.06),
        new CalcNodeConfiguration(1,   "cl", "Cascade Lake",    1.00, ((2 * 0.205) / 0.7) * 1.06)
    ];

    // Отбираем только разрешенные конфигурации.
    table = table.filter(function(conf) { return conf.IsActive; });

    return table;
}

//--------------------------------------------------------------------------------------------------

// Получение конфигурации по имени.
find_calc_node_configuration = function(table, name)
{
    var list = table.filter(c => c.Name == name);

    if (list.length != 1)
    {
        alert("get_calc_node_configuration : проблемы с получением конфигурации по имени");
    }

    return list[0];
}

//--------------------------------------------------------------------------------------------------

// Получение списка конфигураций.
find_calc_nodes_configurations = function(table, names)
{
    return names.map(n => find_calc_node_configuration(table, n));
}

//--------------------------------------------------------------------------------------------------

// Сгенерировать HTML таблицы конфигураций вычислительных узлов.
get_calc_nodes_configuration_table_HTML = function(t)
{
    var head = "<table border=\"0\" align=\"center\">";
    var foot = "</table>";
    var bg = "lightsteelblue";
    var bg_money = "lightgreen";

    head = head + "<tr>";
    head = head + "<th bgcolor=\"" + bg + "\">узел</th>";
    head = head + "<th bgcolor=\"" + bg + "\">описание</th>";
    head = head + "<th bgcolor=\"" + bg + "\">полезность</th>";
    head = head + "<th bgcolor=\"" + bg + "\">энергия</th>";
    if (t[0].FullNodeHours != undefined)
    {
        head = head + "<th bgcolor=\"" + bg + "\">узлочасы</th>";
        head = head + "<th bgcolor=\"" + bg + "\">вес</th>";
    }
    if (t[0].Amort2020 != undefined)
    {
        head = head + "<th bgcolor=\"" + bg + "\">ам. 2020</th>";
        head = head + "<th bgcolor=\"" + bg_money + "\">ам. у*ч</th>";
    }
    if (t[0].EnergyCost != undefined)
    {
        head = head + "<th bgcolor=\"" + bg_money + "\">ээ. у*ч</th>";
    }
    if (t[0].RepairCost != undefined)
    {
        head = head + "<th bgcolor=\"" + bg_money + "\">рм. у*ч</th>";
    }
    if (t[0].OtherCost != undefined)
    {
        head = head + "<th bgcolor=\"" + bg_money + "\">др. у*ч</th>";
    }
    if (t[0].SumCost != undefined)
    {
        head = head + "<th bgcolor=\"" + bg_money + "\">вс. у*ч</th>";
    }
    if (t[0].Rate != undefined)
    {
        head = head + "<th bgcolor=\"" + bg_money + "\">тариф</th>";
    }
    head = head + "</tr>";

    var html =
        t.reduce
        (
            function(acc, conf)
            {
                var res = acc +
                          "<tr>" +
                          "<td bgcolor=\"" + bg + "\" align=\"right\">" +
                          conf.Name +
                          "</td>" +
                          "<td bgcolor=\"" + bg + "\">" +
                          conf.Description +
                          "</td>" +
                          "<td bgcolor=\"" + bg + "\">" +
                          conf.Usefull +
                          "</td>" +
                          "<td bgcolor=\"" + bg + "\">" +
                          conf.Energy.toFixed(3) +
                          "</td>";

                if (conf.FullNodeHours != undefined)
                {
                    res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" +
                          conf.FullNodeHours.toLocaleString() + "</td>";
                    res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" +
                          conf.FullNodeHoursWeight.toFixed(3) + "</td>";
                }

                if (conf.Amort2020 != undefined)
                {
                    res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" +
                          conf.Amort2020.toLocaleString() + "</td>";
                    res = res + "<td bgcolor=\"" + bg_money + "\" align=\"right\">" +
                          conf.NodeHourAmort2020.toLocaleString() + "</td>";
                }

                if (conf.EnergyCost != undefined)
                {
                    res = res + "<td bgcolor=\"" + bg_money + "\" align=\"right\">" +
                          conf.EnergyCost.toLocaleString() + "</td>";
                }

                if (conf.RepairCost != undefined)
                {
                    res = res + "<td bgcolor=\"" + bg_money + "\" align=\"right\">" +
                          conf.RepairCost.toLocaleString() + "</td>";
                }

                if (conf.OtherCost != undefined)
                {
                    res = res + "<td bgcolor=\"" + bg_money + "\" align=\"right\">" +
                          conf.OtherCost.toLocaleString() + "</td>";
                }

                if (conf.SumCost != undefined)
                {
                    res = res + "<td bgcolor=\"" + bg_money + "\" align=\"right\">" +
                          conf.SumCost.toLocaleString() + "</td>";
                }

                if (conf.Rate != undefined)
                {
                    res = res + "<td bgcolor=\"" + bg_money + "\" align=\"right\">" +
                          conf.Rate.toLocaleString() + "</td>";
                }

                res = res + "</tr>";

                return res;
            },
            ""
        );

    return head + html + foot + "<br><br>";
}

//==================================================================================================

// Расписание функционирования вычислительного сегмента.
CalcSegmentSchedule = function(node_name, nodes_count, months_activity)
{
    this.NodeName = node_name;
    this.NodesCount = nodes_count;
    this.MonthsActivity = months_activity;
}

//--------------------------------------------------------------------------------------------------

// Сгенерировать HTML конфигурации вычислительного поля.
get_calc_segments_schedule_table_HTML = function(t)
{
    var head = "<table border=\"0\" align=\"center\">";
    var foot = "</table>";
    var months = [ "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек" ];
    var bg = "#DDDDDD";

    head = head + "<tr>" +
                  "<th bgcolor=\"" + bg + "\"узлы</th>" +
                  "<th bgcolor=\"" + bg + "\">кол-во</th>";
    for (var i = 0; i < months.length; i++)
    {
        head = head + "<th bgcolor=\"" + bg + "\">" + months[i] + "</th>";
    }
    head = head + "</tr>";

    var html =
        t.reduce
        (
            function(acc, sh)
            {
                var res = acc;

                res = res + "<tr>";
                res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" + sh.NodeName + "</td>";
                res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" + sh.NodesCount + "</td>";
                for (var i = 0; i < months.length; i++)
                {
                    var loc_bg = "lightgreen";

                    if (!sh.MonthsActivity[i])
                    {
                        loc_bg = "salmon";
                    }

                    res = res + "<td bgcolor=\"" + loc_bg + "\">&nbsp;</td>";
                }
                res = res + "</tr>";

                return res;
            },
            ""
        );

    return head + html + foot + "<br><br>";
}

//==================================================================================================

// Подсчет полного количества узлочасов для узлов каждого типа.
calculate_full_node_hours = function(confs, scheds)
{
    var mdays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for (var i = 0; i < confs.length; i++)
    {
        var conf = confs[i];
        var name = conf.Name;

        // Достаем из расписаний все строки, связанные с конкретной конфигураций.
        var cur_sheds = scheds.filter(function(sh) { return sh.NodeName == name; });

        // Считаем полное количество узлочасов.
        var full_node_days =
            cur_sheds.map
            (
                function(sh)
                {
                    // Количество дней берем с маской по месяцам.
                    var days = JA.Func.ZipWith(sh.MonthsActivity,
                                                mdays,
                                                function(x, y) { return x * y; });

                    return sh.NodesCount * days.Sum();
                }
            ).Sum();

        conf.FullNodeHours = full_node_days * 24;
    }

    // А теперь добавим вес.
    var total_node_hours = confs.map(function(c) { return c.FullNodeHours; }).Sum();
    confs.forEach(function(c) { c.FullNodeHoursWeight = c.FullNodeHours / total_node_hours; });
}

//==================================================================================================

// Вычисление затрат на энергию.
calculate_energy_costs = function(confs)
{
    var kwh = 4.46;
    var kwm = 734.0;
    var tkwh = kwh + kwm / (30.0 * 24.0);
    var calc_energy_cost = function(e) { return e * tkwh; };

    confs.forEach(c => c.EnergyCost = calc_energy_cost(c.Energy));
}

// Вычисление затрат на ремонт.
calculate_repair_costs = function(confs)
{
    confs.forEach(c => c.RepairCost = 0.0);
    confs.filter(c => c.Name == "hw")[0].RepairCost = 175000.0 / (365.0 * 24.0);
    confs.filter(c => c.Name == "bw")[0].RepairCost = 150000.0 / (365.0 * 24.0);
}

// Другие затраты.
calculate_other_costs = function(confs, tot)
{
    var ks = confs.map(c => c.FullNodeHours * c.Usefull);
    var sum_ks = ks.Sum();
    var ks = ks.map(k => k / sum_ks);

    for (var i = 0; i < confs.length; i++)
    {
        confs[i].OtherCost = tot * ks[i] / confs[i].FullNodeHours;
    }
}

// Суммирование всех затрат.
summarize_all_costs = function(confs)
{
    confs.forEach(c => c.SumCost = c.NodeHourAmort2020 + c.EnergyCost + c.RepairCost + c.OtherCost);
    confs.forEach(c => c.Rate = c.SumCost * 1.15);
}

//==================================================================================================
