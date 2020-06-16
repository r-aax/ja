// Вычислительные ресурсы.

//--------------------------------------------------------------------------------------------------

// Заносим конфигурацию всех узлов:
//   100k - МВС-100К
//     tr - Tornado
//     ps - Petastream
//     hw - Haswell
//     bw - Broadwell
//    knl - Knights Landing
//     sl - Skylake
//     cl - Cascade Lake

//--------------------------------------------------------------------------------------------------

// Конфигурация вычислительного узла.
CalcNodeConfiguration = function(is_active, name)
{
    this.IsActive = is_active;
    this.Name = name;
}

//--------------------------------------------------------------------------------------------------

// Таблица конфигурации вычислительных узлов.
CalcNodesConfigurationTable = function()
{
    var table =
    [
        new CalcNodeConfiguration(true, "100k"),
        new CalcNodeConfiguration(true,   "tr"),
        new CalcNodeConfiguration(true,   "ps"),
        new CalcNodeConfiguration(true,   "hw"),
        new CalcNodeConfiguration(true,   "bw"),
        new CalcNodeConfiguration(true,  "knl"),
        new CalcNodeConfiguration(true,   "sl"),
        new CalcNodeConfiguration(true,   "cl")
    ];

    // Отбираем только разрешенные конфигурации.
    table = table.filter(function(conf) { return conf.IsActive; });

    return table;
}

//--------------------------------------------------------------------------------------------------

// Сгенерировать HTML таблицы конфигураций вычислительных узлов.
get_calc_nodes_configuration_table_HTML = function()
{
    var t = CalcNodesConfigurationTable();
    var head = "<table border=\"0\" align=\"center\">";
    var foot = "</table>";

    var html =
        t.reduce
        (
            function(acc, conf)
            {
                return acc +
                       "<tr>" +
                       "<td bgcolor=\"red\">" +
                       conf.Name +
                       "</td>" +
                       "</tr>";
            },
            ""
        );

    return head + html + foot;
}

//--------------------------------------------------------------------------------------------------
