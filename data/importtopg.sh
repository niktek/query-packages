jq -c '.[]' your_file.json > your_new_file.json
#launch node script
#this script gets around string quoting issues in json imports by adjusting them to a rare character
psql
\copy temp (data) from 'newlinepackage.json' csv quote e'\x01' delimiter e'\x02';