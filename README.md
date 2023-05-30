# RSA-PROJECT

source venv/bin/activate

inside vanetza docker-compose up

python3 generate_vams.py -> envia vams ta dentro do vanetza

flask --app app.py --debug run -> webapp

./IPFS-CLUSTER-ctl add r1/r2.json

 ipfs-cluster-ctl id                                                       # show cluster peer and ipfs daemon information
$ ipfs-cluster-ctl peers ls                                                 # list cluster peers
$ ipfs-cluster-ctl peers rm <peerid>                                        # remove a cluster peer
$ ipfs-cluster-ctl add myfile.txt http://domain.com/file.txt                # adds content to the cluster
$ ipfs-cluster-ctl pin add Qma4Lid2T1F68E3Xa3CpE6vVJDLwxXLD8RfiB9g1Tmqp58   # pins a CID in the cluster
$ ipfs-cluster-ctl pin rm Qma4Lid2T1F68E3Xa3CpE6vVJDLwxXLD8RfiB9g1Tmqp58    # unpins a CID from the cluster
$ ipfs-cluster-ctl pin ls [CID]                                             # list tracked CIDs (shared state)
$ ipfs-cluster-ctl status [CID]                                             # list current status of tracked CIDs (local state)
$ ipfs-cluster-ctl sync Qma4Lid2T1F68E3Xa3CpE6vVJDLwxXLD8RfiB9g1Tmqp58      # re-sync seen status against status reported by the IPFS daemon
$ ipfs-cluster-ctl recover Qma4Lid2T1F68E3Xa3CpE6vVJDLwxXLD8RfiB9g1Tmqp58   # attempt to re-pin/unpin CIDs in error state

content IDS:
Qme6vrVn9NKk2SaUTMqtNxi5oLZ5zPYANq4EpJ6Kiq6hDu -> Restaurant 1 (Gran turino)
QmfSwY59NkktLzz3eBVZAicJQNYPVPHHKkP8ZVvg9a6kL6 -> Restaurant 2 (O bairro) 