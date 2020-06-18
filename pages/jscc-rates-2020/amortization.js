// Амортизация вычислительных систем.

//==================================================================================================

// Реализация с распределением амортиации по месяцам.
// Предусмотрена возможность изменения графика амортизации в произвольной точке времени.

// Хранилище для реализации амортизации.
//
//   year - год, с которого начинаем учет амортизации,
//   month - месяц, с которого начинаем учет амортизации,
//   months - на какое количество месяцев в принципе распространяется амортизация.
AmortizationBank = function(year, month, months)
{
    this.Year = year;
    this.Month = month;
    this.Months = months;

    // Банк состоит из montsh элементов, в каждом из которых прописаны деньги.
    // Инициализируем все это просто нулями.
    this.E = [];
    for (var i = 0; i < this.Months; i++)
    {
        this.E.push(0.0);
    }
}

//--------------------------------------------------------------------------------------------------

// Доступ к элементам банка.
AmortizationBank.prototype.Index = function(year, month)
{
    var index = (year * 12 + month) - (this.Year * 12 + this.Month);

    // Ловим выход за пределы массива месяцев.
    if (index >= this.Months)
    {
        alert("AmortizationBank.Index : для месяца " +
              year + ", " + month +
              "расчет амортизации не предусмотрен.");
    }

    return index;
}
AmortizationBank.prototype.Get = function(year, month)
{
    return this.E[this.Index(year, month)];
}
AmortizationBank.prototype.Set = function(year, month, val)
{
    this.E[this.Index(year, month)] = val;
}
AmortizationBank.prototype.GetYear = function(year)
{
    return Array.Range(12).map(m => this.Get(year, m)).Sum();
}
AmortizationBank.prototype.GetAllFrom = function(year, month)
{
    var res = 0.0;

    for (var i = this.Index(year, month); i < this.Months; i++)
    {
        res = res + this.E[i];
    }

    return res;
}
AmortizationBank.prototype.SetAllFrom = function(year, month, val)
{
    for (var i = this.Index(year, month); i < this.Months; i++)
    {
        this.E[i] = val;
    }
}
AmortizationBank.prototype.Spread = function(year, month, money, months)
{
    var quote = money / months;

    for (var i = 0; i < months; i++)
    {
        var index = this.Index(year, month) + i;

        // Ловим выход за пределы массива месяцев.
        if (index >= this.Months)
        {
            alert("AmortizationBank.Spread : для месяца " +
                  year + ", " + month +
                  "расчет амортизации не предусмотрен.");
        }

        this.E[index] = quote;
    }
}

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
        line.Bank = new AmortizationBank(2014, 0, 200);

        // Распределяем амортизацию сразу и по-тупому.
        line.Bank.Spread(line.DatePoint.getFullYear(),
                         line.DatePoint.getMonth() + 1,
                         line.Money,
                         line.Years * 12);
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

                for (var i = 2014; i <= 2023; i++)
                {
                    var bb = (i == 2020) ? "<b><font color=\"indianred\">" : "";
                    var be = (i == 2020) ? "</font></b>" : "";

                    res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" +
                                "<font size=\"-2\">" +
                                bb + al.Bank.GetYear(i).toLocaleString() + be +
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

                e.Amort2020 = e.Amort2020 + line.Bank.GetYear(2020);
            }
        }
        else
        {
            // Если система не определена, то кидаем на все узлы с весовыми коэффициентами.
            for (var j = 0; j < confs.length; j++)
            {
                var e = confs[j];

                e.Amort2020 = e.Amort2020 + (e.FullNodeHoursWeight * line.Bank.GetYear(2020));
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
