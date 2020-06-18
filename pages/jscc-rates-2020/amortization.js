// Амортизация вычислительных систем.

//==================================================================================================

// Строка таблицы амортизации.
AmortizationLine = function(node_names, date_point, money, years)
{
    this.NodeNames = node_names;
    this.DatePoint = date_point;
    this.Money = money;
    this.Years = years;
}

//--------------------------------------------------------------------------------------------------

// Расчет амортизации по годам.
calculate_amortization = function(t)
{
    for (var i = 0; i < t.length; i++)
    {
        line = t[i];
        line.ValuesFrom2014 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (var j = 0; j < line.ValuesFrom2014.length; j++)
        {
            // Расчет амортизации для года (2014 + j).

            var am_start = (line.DatePoint.getFullYear() - 2014) * 12 +
                           (line.DatePoint.getMonth() + 1); // амортизация начинается со следующего месяца
            var am_length = line.Years * 12;
            var am_end = am_start + am_length - 1;
            var year_start = j * 12;
            var year_end = year_start + 11;
            var am_length_in_year = 0;

            // Пересечение.
            var start = Math.max(am_start, year_start);
            var end = Math.min(am_end, year_end);
            if (start <= end)
            {
                am_length_in_year = end - start + 1;
            }

            var am = line.Money * (am_length_in_year / am_length);

            line.ValuesFrom2014[j] = am;
        }
    }
}

//--------------------------------------------------------------------------------------------------

// Генерация HTML.
get_amortization_table_HTML = function(t)
{
    var head = "<table border=\"0\" align=\"center\">";
    var foot = "</table>";
    var bg = "#DDDDDD";

    head = head + "<tr>";
    head = head + "<th bgcolor=\"" + bg + "\">узлы</th>";
    head = head + "<th bgcolor=\"" + bg + "\">дата</th>";
    head = head + "<th bgcolor=\"" + bg + "\">сумма</th>";
    head = head + "<th bgcolor=\"" + bg + "\">годы</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2014</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2015</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2016</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2017</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2018</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2019</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2020</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2021</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2022</th>";
    head = head + "<th bgcolor=\"" + bg + "\">2023</th>";
    head = head + "</tr>";

    var fun_add_0_to_digit = function(d) { return (d < 10) ? ("0" + d) : d; }

    var html =
        t.reduce
        (
            function(acc, al)
            {
                var res = acc;
                var names_str = al.NodeNames;

                if (names_str == undefined)
                {
                    names_str = "<i><font color=\"darkgrey\">все системы</font></i>";
                }

                res = res + "<tr>";
                res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" + names_str + "</td>"
                res = res + "<td bgcolor=\"" + bg + "\">" +
                            al.DatePoint.getFullYear() + "-" +
                            fun_add_0_to_digit(al.DatePoint.getMonth() + 1) + "-" +
                            fun_add_0_to_digit(al.DatePoint.getDate()) +
                            "</td>";
                res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" + al.Money.toLocaleString() + "</td>";
                res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" + al.Years + "</td>"

                for (var i = 0; i < al.ValuesFrom2014.length; i++)
                {
                    var is_2020 = ((2014 + i) == 2020);
                    var bb = is_2020 ? "<b><font color=\"indianred\">" : "";
                    var be = is_2020 ? "</font></b>" : "";

                    res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" +
                                "<font size=\"-2\">" +
                                bb + al.ValuesFrom2014[i].toLocaleString() + be +
                                "</font></td>";
                }

                res = res + "</tr>";

                return res;
            },
            ""
        );

    return head + html + foot + "<br><br>";
}

//--------------------------------------------------------------------------------------------------

// Распределить амортизацию между системами.
distribute_amortization = function(confs, amort)
{
    for (var i = 0; i < confs.length; i++)
    {
        confs[i].Amort2020 = 0.0;
    }

    // Ходим по таблице амортизации, вытаскиваем строки и распределяем по системам.
    for (var i = 0; i < amort.length; i++)
    {
        var line = amort[i];

        if (line.NodeNames != undefined)
        {
            var find_conf = confs.filter(function(c) { return c.Name == line.NodeNames; });

            if (find_conf.length > 0)
            {
                var e = find_conf[0];

                e.Amort2020 = e.Amort2020 + line.ValuesFrom2014[2020 - 2014];
            }
        }
        else
        {
            // Если система не определена, то кидаем на все узлы с весовыми коэффициентами.
            for (var j = 0; j < confs.length; j++)
            {
                var e = confs[j];

                e.Amort2020 = e.Amort2020 + (e.FullNodeHoursWeight * line.ValuesFrom2014[2020 - 2014]);
            }
        }
    }

    // Амортизация на узлочас.
    for (var i = 0; i < confs.length; i++)
    {
        confs[i].NodeHourAmort2020 = confs[i].Amort2020 / confs[i].FullNodeHours;
    }
}

//==================================================================================================
