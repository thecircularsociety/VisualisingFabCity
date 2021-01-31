using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace BackEnd
{
    public class Entity
    {
        [JsonProperty("id")]
        public int Id;
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("links")]
        public string Links { get; set; }

        //public Dictionary<Principle, int> Principles = new Dictionary<Principle, int>();

        public string ToJsonString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }

    //public enum Principle
    //{
    //    Ecological,
    //    Inclusive,
    //    Glocalism,
    //    Participatory,
    //    Economic,
    //    LocallyProductive,
    //    PeopleCentred,
    //    Holistic,
    //    OpenSource,
    //    Experimental
    //}

    //// Add principles where they have a score > 0
    //for (int j = 0; j < 10; j++)
    //{
    //    var value = csv.GetField<int>(j + 3);

    //    if (value > 0)
    //    {
    //        entitiesToSend[i].Principles[(Principle)j] = value;
    //    }
    //}
}

