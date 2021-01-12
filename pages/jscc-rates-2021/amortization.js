// Амортизация вычислительных систем.

//==================================================================================================

// Реализация с распределением амортизации по месяцам.
// Предусмотрена возможность изменения графика амортизации в произвольной точке времени.

// Хранилище для реализации амортизации.
//
// Аргументы:
//   year - год, с которого начинаем учет амортизации,
//   month - месяц, с которого начинаем учет амортизации,
//   months - на какое количество месяцев в принципе распространяется амортизация.
AmortizationBank = function(year, month, months)
{
    this.Year = year;
    this.Month = month;
    this.Months = months;

    // Банк состоит из months элементов, в каждом из которых прописаны деньги.
    // Инициализируем все это просто нулями.
    this.E = [];
    for (var i = 0; i < this.Months; i++)
    {
        this.E.push(0.0);
    }
}

//--------------------------------------------------------------------------------------------------

// Доступ к элементам банка.
//
// Результат:
//   Индекс в банке амортизации.
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

// Получение значения амортизации в точке.
AmortizationBank.prototype.Get = function(year, month)
{
    return this.E[this.Index(year, month)];
}

// Установка значения амортизации в точке.
AmortizationBank.prototype.Set = function(year, month, val)
{
    this.E[this.Index(year, month)] = val;
}

// Получение суммарной амортизации за год.
AmortizationBank.prototype.GetYear = function(year)
{
    return Array.Range(12).map(m => this.Get(year, m)).Sum();
}

// Получение суммарной амортизации, начиная с данной точки.
AmortizationBank.prototype.GetAllFrom = function(year, month)
{
    var res = 0.0;

    for (var i = this.Index(year, month); i < this.Months; i++)
    {
        res = res + this.E[i];
    }

    return res;
}

// Установка фиксированной суммы амортизации во все месяцы, начиная с заданной точки.
AmortizationBank.prototype.SetAllFrom = function(year, month, val)
{
    for (var i = this.Index(year, month); i < this.Months; i++)
    {
        this.E[i] = val;
    }
}

// Размазывание суммы амортизации начиная с заданной точки на фиктированное количество месяцев.
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

//--------------------------------------------------------------------------------------------------

// Получение первого и последнего ненулевого индекса месяца.
AmortizationBank.prototype.GetFirstNotNullMonthIndex = function()
{
    for (var i = 0; i < this.E.length; i++)
    {
        if (this.E[i] > 0.0)
        {
            return i;
        }
    }

    return -1;
}
AmortizationBank.prototype.GetLastNotNullMonthIndex = function()
{
    for (var i = this.E.length - 1; i >= 0; i--)
    {
        if (this.E[i] > 0.0)
        {
            return i;
        }
    }

    return -1;
}

//==================================================================================================

// Строка таблицы амортизации.
AmortizationLine = function(node_names, comment, date_point, money)
{
    this.NodeNames = node_names;
    this.Comment = comment;
    this.DatePoint = date_point;
    this.Money = money;

    // Сразу создаем банк.
    this.Bank = new AmortizationBank(2012, 0, 300);
}

//--------------------------------------------------------------------------------------------------

// Получение индекса даты привязки.
AmortizationLine.prototype.GetDatePointMonthIndex = function()
{
    return this.Bank.Index(this.DatePoint.getFullYear(),
                           this.DatePoint.getMonth());
}

//--------------------------------------------------------------------------------------------------

// Распределение амортизации с некоторого месяца на данное количество месяцев.
AmortizationLine.prototype.SpreadAmortization = function(from_year, from_month, months)
{
    this.Bank.Spread(from_year, from_month, this.Money, months);
}
AmortizationLine.prototype.SpreadAmortizationFromThis = function(months)
{
    this.SpreadAmortization(this.DatePoint.getFullYear(),
                            this.DatePoint.getMonth(),
                            months);
}
AmortizationLine.prototype.SpreadAmortizationFromNext = function(months)
{
    this.SpreadAmortization(this.DatePoint.getFullYear(),
                            this.DatePoint.getMonth() + 1,
                            months);
}
AmortizationLine.prototype.SpreadAmortizationFromThisToRefLine = function(ref_line)
{
    var index = line.GetDatePointMonthIndex();
    var ref_index = ref_line.Bank.GetLastNotNullMonthIndex();

    this.SpreadAmortization(this.DatePoint.getFullYear(),
                            this.DatePoint.getMonth(),
                            ref_index - index + 1);
}
AmortizationLine.prototype.SpreadAmortizationFromNextToRefLine = function(ref_line)
{
    var index = line.GetDatePointMonthIndex();
    var ref_index = ref_line.Bank.GetLastNotNullMonthIndex();

    this.SpreadAmortization(this.DatePoint.getFullYear(),
                            this.DatePoint.getMonth() + 1,
                            ref_index - index);
}

//--------------------------------------------------------------------------------------------------

// Генерация HTML.
get_amortization_table_HTML = function(t)
{
    var head = "<table border=\"0\" align=\"center\">";
    var foot = "</table>";
    var bg = "#DDDDDD";
    var bg2 = "#F5F5F5";
    var year_from = 2014;
    var year_to = 2026;

    head = head + "<tr>";
    head = head + "<th bgcolor=\"" + bg + "\">узлы</th>";
    head = head + "<th bgcolor=\"" + bg + "\">договор</th>";
    head = head + "<th bgcolor=\"" + bg + "\">поставка</th>";
    head = head + "<th bgcolor=\"" + bg + "\">сумма</th>";
    for (var i = year_from; i <= year_to; i++)
    {
        head = head + "<th bgcolor=\"" + bg + "\">" + i + "</th>";
    }
    head = head + "</tr>";

    var fun_add_0_to_digit = function(d) { return (d < 10) ? ("0" + d) : d; }

    var html =
        t.reduce
        (
            function(acc, al)
            {
                var res = acc;
                var names_str = al.NodeNames;

                if (names_str.length > 1)
                {
                    names_str = "<i><font color=\"darkgrey\">" + al.NodeNames + "</font></i>";
                }

                res = res + "<tr>";
                res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" + names_str + "</td>"
                res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" + al.Comment + "</td>"
                res = res + "<td bgcolor=\"" + bg + "\">" +
                            al.DatePoint.getFullYear() + "-" +
                            fun_add_0_to_digit(al.DatePoint.getMonth() + 1) + "-" +
                            fun_add_0_to_digit(al.DatePoint.getDate()) +
                            "</td>";
                res = res + "<td bgcolor=\"" + bg + "\" align=\"right\">" + al.Money.toLocaleString() + "</td>";

                for (var i = year_from; i <= year_to; i++)
                {
                    var bb = (i == 2020) ? "<b><font color=\"indianred\">" : "";
                    var be = (i == 2020) ? "</font></b>" : "";

                    res = res + "<td bgcolor=\"" + bg2 + "\" align=\"right\">" +
                                "<font size=\"-2\">" +
                                bb + al.Bank.GetYear(i).toLocaleString() + be +
                                "</font></td>";
                }

                res = res + "</tr>";

                return res;
            },
            ""
        );

    html = html + "<tr>";
    html = html + "<td bgcolor=\"" + bg + "\">&nbsp;</td>";
    html = html + "<td bgcolor=\"" + bg + "\">&nbsp;</td>";
    html = html + "<td bgcolor=\"" + bg + "\">&nbsp;</td>";
    html = html + "<td bgcolor=\"" + bg + "\">&nbsp;</td>";
    for (var i = year_from; i <= year_to; i++)
    {
        var bb = (i == 2020) ? "<b><font color=\"indianred\">" : "";
        var be = (i == 2020) ? "</font></b>" : "";

        html = html + "<td bgcolor=\"" + bg + "\" align=\"right\">" +
                      "<b><font size=\"-2\">" +
                      bb +
                      t.map(al => al.Bank.GetYear(i)).Sum().toLocaleString() +
                      be +
                      "</font></b></td>";

    }
    html = html + "</tr>";

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

        // Амортизация считается одинаковым образом как для распределения на одну систему,
        // так и для распределения на несколько систем.
        var distr_confs = find_calc_nodes_configurations(confs, line.NodeNames);
        var distr_weights = distr_confs.map(c => c.FullNodeHoursWeight);
        var distr_weights_sum = distr_weights.Sum();
        distr_weights = distr_weights.map(w => w / distr_weights_sum);
        var value = line.Bank.GetYear(2020);
        for (var j = 0; j < distr_confs.length; j++)
        {
            distr_confs[j].Amort2020 = distr_confs[j].Amort2020 + (distr_weights[j] * value);
        }
    }

    // Амортизация на узлочас.
    for (var i = 0; i < confs.length; i++)
    {
        confs[i].NodeHourAmort2020 = confs[i].Amort2020 / confs[i].FullNodeHours;
    }
}

//==================================================================================================
