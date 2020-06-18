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
CalcNodeConfiguration = function(is_active, name, descr)
{
    this.IsActive = is_active;
    this.Name = name;
    this.Description = descr;
}

//--------------------------------------------------------------------------------------------------

// Таблица конфигурации вычислительных узлов.
CalcNodesConfigurationTable = function()
{
    var table =
    [
        new CalcNodeConfiguration(0, "100k", "MVS-100K"),
        new CalcNodeConfiguration(1,   "tr", "Tornado"),
        new CalcNodeConfiguration(0,   "ps", "Petastream"),
        new CalcNodeConfiguration(1,   "hw", "Haswell"),
        new CalcNodeConfiguration(1,   "bw", "Broadwell"),
        new CalcNodeConfiguration(1,  "knl", "Knights Landing"),
        new CalcNodeConfiguration(1,   "sl", "Skylake"),
        new CalcNodeConfiguration(1,   "cl", "Cascade Lake")
    ];

    // Отбираем только разрешенные конфигурации.
    table = table.filter(function(conf) { return conf.IsActive; });

    return table;
}

//--------------------------------------------------------------------------------------------------

// Сгенерировать HTML таблицы конфигураций вычислительных узлов.
get_calc_nodes_configuration_table_HTML = function(t)
{
    var head = "<table border=\"0\" align=\"center\">";
    var foot = "</table>";
    var bg = "lightsteelblue";

    head = head + "<tr>";
    head = head + "<th bgcolor=\"" + bg + "\">узел</th>";
    head = head + "<th bgcolor=\"" + bg + "\">описание</th>";
    if (t[0].FullNodeHours != undefined)
    {
        head = head + "<th bgcolor=\"" + bg + "\">узлочасы</th>";
        head = head + "<th bgcolor=\"" + bg + "\">вес</th>";
    }
    if (t[0].Amort2020 != undefined)
    {
        head = head + "<th bgcolor=\"" + bg + "\">амортизация 2020</th>";
        head = head + "<th bgcolor=\"" + bg + "\">амортизация узлочаса 2020</th>";
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
                    res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" +
                          conf.NodeHourAmort2020.toLocaleString() + "</td>";
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
                    var days = JA.Func.zip_with(sh.MonthsActivity,
                                                mdays,
                                                function(x, y) { return x * y; });

                    return sh.NodesCount * days.sum();
                }
            ).sum();

        conf.FullNodeHours = full_node_days * 24;
    }

    // А теперь добавим вес.
    var total_node_hours = confs.map(function(c) { return c.FullNodeHours; }).sum();
    confs.forEach(function(c) { c.FullNodeHoursWeight = c.FullNodeHours / total_node_hours; });
}

//==================================================================================================