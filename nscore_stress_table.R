#load datatables library
library(DT)
library(htmlwidgets)

#load neighborhood stress index csv
nscores <- read.csv("final_neighborhood_scores_and_data.csv")

#create a shortened list of variables to include in the table.
##Place the index numbers in the order you want them to appear in the table.
nscores_shortTable <- nscores[c(2,12,15,18,7,25,3)]

#create data table as R object
neighborhood_short_score_table <- datatable((nscores_shortTable), 
  colnames=c("Neighborhood", "Crime Change", "Income Change", "Population Change", "Poverty Index", "Home Price Change", "Category"), 
  rownames = FALSE, 
  options = list(
    dom = 't',
    autowidth = TRUE,
    columnDefs = list((list(className = 'dt-center', targets = c(1,2,3,4,5,6)) )),
    scrollCollapse=TRUE,
    pageLength = 55,
    initComplete = JS(
      "function(settings, json) {",
      "$(this.api().table().header()).css({'background-color': '#5B5B5B', 'color': '#fff', 'font-family': 'helvetica', 'font-size': '12px'});",
      "}"))) %>%
  formatPercentage(c('crimeChange', 'incChange', 'popChange', 'MHSDifPerc'), 1) %>%
  formatStyle(c('Neighborhood', 'category', 'crimeChange', 'incChange', 'popChange', 'PovScore', 'MHSDifPerc'), fontSize = '11px', fontFamily = 'helvetica') %>%
  formatStyle(c('Neighborhood'), fontWeight = 'bold') %>%
  formatStyle('category',backgroundColor = styleEqual(c('Facing the Greatest Challenges', 'Falling Behind', 'Average', 'Advancing', 'Making the Greatest Advances'), c('#BB4107', '#DC7C4E', '#9D88A6', '#6F4D8F', '#1F0439')))%>%
  formatStyle('category',color = '#FFF')


#save the widget as an html page
saveWidget(neighborhood_short_score_table, "score_table.html", selfcontained = FALSE, libdir = "src")
