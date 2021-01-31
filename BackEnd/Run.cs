using System.Collections.Generic;
using System.Globalization;
using System.IO;
using BackEnd;
using CsvHelper;
using Newtonsoft.Json;

namespace Backend
{
    public class Link
    {
        public int source;
        public int target;
    }

    public class DataModel
    {
        public List<Entity> nodes = new List<Entity>();
        public List<Link> links = new List<Link>();
    }

    public class Run
    {
        static Dictionary<string, int> namesToIdsMap = new Dictionary<string, int>();

        static void Main(string[] args)
        {
            DataModel data = new DataModel();

            using (var reader = new StreamReader(@"FabCityPlymouth.csv"))
            {
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    int i = 0;
                    while(csv.Read())
                    {
                        var record = csv.GetRecord<Entity>();
                        record.Id = i;
                        data.nodes.Add(record);
                        namesToIdsMap[record.Name] = i;
                        i++;
                    }
                }
            }
            SetLinkIds(data);

            using (StreamWriter outputFile = new StreamWriter("data.json"))
            {
                var allJson = JsonConvert.SerializeObject(data, Formatting.Indented);
                outputFile.Write(allJson);
            }
        }

        public static int? FindIdByName(string name)
        {
            int id;
            if (namesToIdsMap.TryGetValue(name, out id)) return id;
            return null;
        }

        private static void SetLinkIds(DataModel data)
        {
            foreach(var node in data.nodes)
            {
                string[] linksFromCsv = node.Links.Split(';');
                foreach (string link in linksFromCsv)
                {
                    var sourceId = node.Id;
                    var targetId = FindIdByName(link.Trim());
                    if (targetId != null)
                    {
                        data.links.Add(new Link
                        {
                            source = sourceId,
                            target = (int)targetId
                        });
                    }
                }
            }
            
        }
    }
}
